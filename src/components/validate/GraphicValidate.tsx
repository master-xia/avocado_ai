import { getGraphicValidate, validateGraphicCode } from '@api/cmmon'
import { errorMsg, successMsg } from '@utils/common'
import {
  Dialog,
  Form,
  Input,
  NumberKeyboard,
  PasscodeInput,
  PasscodeInputRef,
} from 'antd-mobile'
import { FormInstance } from 'rc-field-form'
import {
  ForwardRefRenderFunction,
  Ref,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'

interface IGraphicVaidateProps {
  success: (token: string) => void
}
export interface IGraphicVaidateRef {
  show: () => void
  hide: () => void
}
let GraphicVaidate: ForwardRefRenderFunction<
  IGraphicVaidateRef,
  IGraphicVaidateProps
> = (props: IGraphicVaidateProps, ref: Ref<IGraphicVaidateRef>) => {
  let [codeData, setCodeData] = useState<ValidateGraphic>()
  let [visible, setVisible] = useState(false)
  let formRef = useRef<FormInstance>(null)

  function refresh() {
    getGraphicValidate().then((res) => {
      if (res.IsSuccess) {
        setCodeData(res.Result)
        formRef.current?.setFieldValue('Token', res.Result?.Token)
        window.setTimeout(() => {
          passwordRef.current?.focus()
        }, 50)
      } else {
        errorMsg(res.Message, true)
      }
    })
  }
  function show() {
    setCodeData(undefined)
    setVisible(true)
  }
  function hide() {
    setVisible(false)
    passwordRef.current?.blur()
  }
  let passwordRef = useRef<PasscodeInputRef>(null)
  let [code, setCode] = useState('')
  useImperativeHandle(ref, () => ({ show, hide }))
  return (
    <>
      <Dialog
        visible={visible}
        title="安全验证"
        afterShow={refresh}
        content={
          <>
            <Form
              ref={formRef}
              style={{ '--border-top': 'none', '--border-bottom': 'none' }}
              layout="vertical"
              requiredMarkStyle="none"
            >
              <div
                style={{
                  height: 60,
                  justifyContent: 'center',
                  display: 'flex',
                  marginBottom: 15,
                }}
              >
                {codeData && (
                  <img
                    src={codeData.ImageBase64}
                    style={{ height: 60 }}
                    alt="验证码"
                    onClick={refresh}
                  />
                )}
              </div>
              <div
                style={{
                  justifyContent: 'center',
                  display: 'flex',
                }}
              >
                <PasscodeInput
                  ref={passwordRef}
                  value={code}
                  onChange={(text) => {
                    setCode(text)
                  }}
                  onFill={(code) => {
                    validateGraphicCode({
                      Token: codeData?.Token,
                      Code: code,
                    }).then((res) => {
                      setCode('')
                      if (res.IsSuccess) {
                        //successMsg('验证成功')
                        setVisible(false)
                        props.success(res.Result)
                      } else {
                        errorMsg(res.Message, true)
                        window.setTimeout(() => {
                          refresh()
                        }, 700)
                      }
                    })
                  }}
                  length={4}
                  plain
                  keyboard={<NumberKeyboard />}
                />
              </div>
            </Form>
            <div>
              <div></div>
            </div>
          </>
        }
        closeOnAction
        onClose={() => {
          setVisible(false)
        }}
        actions={[
          [
            {
              key: 'cancel',
              text: '取消',
            },
          ],
        ]}
      />
    </>
  )
}

export default forwardRef(GraphicVaidate)
