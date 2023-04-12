import {
  createDrawing,
  getDrawingParamsVM,
  getModelExamples,
} from '@api/drawing'
import Avocado from '@components/common/Avocado'
import { PageHeader } from '@components/common/PageHeader'
import { useAppDispatch, useAppSelector } from '@store/hooks'
import { updateAvocadoInfoAsyn } from '@store/modules/settings'
import {
  combineTwoList,
  errorMsg,
  isNumber,
  isWxEnv,
  successMsg,
} from '@utils/common'

import {
  Avatar,
  Button,
  Dialog,
  Ellipsis,
  ErrorBlock,
  Form,
  Grid,
  InfiniteScroll,
  Input,
  Picker,
  Popup,
  Selector,
  Slider,
  Stepper,
  TextArea,
} from 'antd-mobile'
import { FormInstance } from 'antd-mobile/es/components/form'
import { FormItem } from 'antd-mobile/es/components/form/form-item'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UploadSingleImage } from '@components/file/UploadSingleImage'
import { CloseOutline } from 'antd-mobile-icons'
import { getAiDrawingUplodaToAliyunOSSPolicyToken } from '@api/file'

export default function Create() {
  const [drawingParams, setDrawingParams] = useState<DrawingParamsVM>()
  useEffect(() => {
    getDrawingParamsVM().then((res) => {
      if (res.IsSuccess) {
        setDrawingParams(res.Result)
      } else {
        errorMsg(res.Message)
      }
    })
  }, [])

  useEffect(() => {}, [])
  return (
    <>
      <PageHeader title={'AI绘图'} />

      <Img2ImgForm drawingParams={drawingParams} />
    </>
  )
}
interface IFormParams {
  drawingParams: DrawingParamsVM | undefined
}
function Img2ImgForm(props: IFormParams) {
  let navigate = useNavigate()
  const [exampleVisible, setExampleVisible] = useState(false)

  let formRef = useRef<FormInstance>(null)
  let [steps, setSteps] = useState(0)
  let [selectRatio, setSelectRatio] =
    useState<DrawingModelPropertyRatioInfoVM>()
  let [selectDrawType, setSelectDrawType] = useState(0)
  //是否重建脸部
  let [selectRestoreFaces, setSelectRestoreFaces] = useState(0)
  let [selectArtist, setSelectArtist] = useState<string[]>([])
  let [selectStyle, setSelectStyle] = useState<string[]>([])
  let [selectQuality, setSelectQuality] = useState<DrawingModelPropertyInfoVM>()
  let [selectModel, setSelectModel] = useState<DrawingModelInfoVM>()
  let [selectModelId, setSelectModelId] = useState<string>('')
  let [selectSamplingMethod, setSelectSamplingMethod] = useState('')
  let [selectTags, setSelectTags] = useState<string[]>([])
  let [selectNegativeTags, setSelectNegativeTags] = useState<string[]>([])
  const dispatch = useAppDispatch()
  const avocadoInfo = useAppSelector((m) => m.settings.avocadoInfo)
  useEffect(() => {
    if (avocadoInfo === undefined) {
      dispatch(updateAvocadoInfoAsyn())
    }
  }, [])
  let models = useMemo(() => {
    if (props.drawingParams) {
      return props.drawingParams.Models.map((m) => ({
        label: (
          <>
            <Ellipsis content={m.ModelName} />
          </>
        ),
        value: m.ModelId,
      }))
    }
    return []
  }, [props.drawingParams])
  let artists = useMemo(() => {
    if (props.drawingParams) {
      return props.drawingParams.Artists.map((m) => ({
        label: (
          <>
            <Ellipsis content={m} />
          </>
        ),
        value: m,
      }))
    }
    return []
  }, [props.drawingParams])
  let styles = useMemo(() => {
    if (props.drawingParams) {
      return props.drawingParams.Styles.map((m) => ({
        label: (
          <>
            <Ellipsis content={m} />
          </>
        ),
        value: m,
      }))
    }
    return []
  }, [props.drawingParams])
  let tags = useMemo(() => {
    if (props.drawingParams) {
      return props.drawingParams.Tags.map((m) => ({
        label: (
          <>
            <Ellipsis content={m} />
          </>
        ),
        value: m,
      }))
    }
    return []
  }, [props.drawingParams])
  let negativeTags = useMemo(() => {
    if (props.drawingParams) {
      return props.drawingParams.NegativeTags.map((m) => ({
        label: (
          <>
            <Ellipsis content={m} />
          </>
        ),
        value: m,
      }))
    }
    return []
  }, [props.drawingParams])
  let ratios = useMemo(() => {
    const maxHeight = 50
    const maxWidth = 50

    if (selectModel && selectQuality) {
      let info = selectModel.PropertyList.filter(
        (m) => m.PropertyId === selectQuality?.PropertyId
      )[0]!.RatioList.map((m) => {
        let w = 0
        let h = 0
        let tmp = m.Label.split(':')
        let rW = parseInt(tmp[0])
        let rH = parseInt(tmp[1])
        let v = rW / rH
        if (maxHeight * v > maxWidth) {
          w = maxWidth
          h = w / v
        } else {
          h = maxHeight
          w = h * v
        }
        let picWidth = selectModel!.Width
        let picHeight = selectModel!.Height
        if (v < 1) {
          picHeight /= v
        } else {
          picWidth *= v
        }
        m.Width = Math.round(picWidth * selectQuality!.Resize)
        m.Height = Math.round(picHeight * selectQuality!.Resize)
        return {
          ...m,
          ConWidth: w,
          ConHeight: h,
        }
      })
      return info
    }
    return []
  }, [selectQuality])
  let drawTypes = useMemo(() => {
    return [
      {
        label: '文字转图片',
        value: 0,
      },
      {
        label: '图生图',
        value: 1,
      },
    ]
  }, [])
  let restroreFaces = useMemo(() => {
    return [
      {
        label: '默认',
        value: 0,
      },
      {
        label: '细致化脸部',
        value: 1,
      },
    ]
  }, [])
  function submit() {
    var values = formRef.current!.getFieldsValue()!
    var msg = ''
    if (
      selectDrawType === 1 &&
      (!values.SourceFileId || values.SourceFileId.length === 0)
    ) {
      msg = '启发图必须上传'
    } else if (
      (!values.Prompt || values.Prompt.trim().length === 0) &&
      selectTags.length === 0
    ) {
      msg = '请输入提示词内容或选择一个提示词'
    } else if (!selectRatio) {
      msg = '图片比例必须选择'
    } else if (!values.Seed || values.Seed.trim().length === 0) {
      msg = '种子必须填写'
    } else if (!isNumber(values.Seed)) {
      msg = '种子必须是数字'
    }
    let seed = parseInt(values.Seed)
    if (seed !== -1) {
      values.Seed = Math.abs(seed)
    } else {
      values.Seed = Math.round(new Date().getTime() / 1000)
    }
    if (msg) {
      errorMsg(msg)
      return
    }
    values.Artists = selectArtist
    values.Styles = selectStyle
    values.Tags = selectTags
    values.NegativeTags = selectNegativeTags
    values.RatioId = selectRatio!.RatioId
    values.ModelId = selectRatio!.ModelId
    values.PropertyId = selectRatio?.PropertyId
    values.DrawType = selectDrawType
    values.RestoreFaces = selectRestoreFaces === 1
    Dialog.confirm({
      title: '提示',
      content: (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span>
            <span>本次需要消耗{totalCost}</span>
            <Avocado />
            <span>是否开始绘制？</span>
          </span>
        </div>
      ),
      onConfirm: () => {
        createDrawing(values)
          .then((res) => {
            if (res.IsSuccess) {
              successMsg('创建成功')
              window.setTimeout(() => {
                navigate('/p/' + res.Result, { replace: true })
              }, 500)
            } else {
              if (res.Code !== 40001) {
                errorMsg(res.Message)
              }
            }
          })
          .catch(() => {
            errorMsg('服务器异常')
          })
      },
    })
  }
  //图片数量
  const [imageCount, setImageCount] = useState(1)
  function setDefaultValues() {
    formRef.current?.resetFields()
    setSelectQuality(undefined)
    formRef.current?.setFieldValue('ImageCount', 1)
    setImageCount(1)
    formRef.current?.setFieldValue('DrawType', [0])
    setSelectDrawType(0)
    formRef.current?.setFieldValue('RestoreFaces', [0])
    setSelectRestoreFaces(0)
    modelChanged(undefined)
  }

  const [samplingMethodsVisible, setSamplingMethodsVisible] = useState(false)
  const samplingMethods = useMemo(() => {
    if (props.drawingParams) {
      return [
        props.drawingParams.SamplingMethods.map((m) => ({
          label: m,
          value: m,
        })),
      ]
    }
    return []
  }, [props.drawingParams])
  const qualities = useMemo(() => {
    if (selectModel) {
      return selectModel.PropertyList.map((m) => ({
        label: m.Label,
        value: m.PropertyId,
      }))
    }
    return []
  }, [selectModel])
  /**
   * 模型改变，修改默认参数
   * @param modelId
   */
  function modelChanged(model: DrawingModelInfoVM | undefined) {
    if (!model) {
      model = props.drawingParams?.Models[0]
    }
    setSelectModelId(model!.ModelId)
    let tmpProperty: DrawingModelPropertyInfoVM | undefined = undefined

    if (selectQuality) {
      var sameProperty = model!.PropertyList.filter(
        (m) => m.Label === selectQuality?.Label
      )
      if (sameProperty.length > 0) {
        //这个模型有相同的属性
        tmpProperty = sameProperty[0]
      } else {
        //默认模型第一个属性
        tmpProperty = model!.PropertyList[0]
      }
    } else {
      //默认模型第一个属性
      tmpProperty = model!.PropertyList[0]
    }
    let tmpRatio: DrawingModelPropertyRatioInfoVM | undefined = undefined
    if (selectRatio) {
      var sameRatio = tmpProperty!.RatioList.filter(
        (m) => m.Label === selectRatio?.Label
      )
      if (sameRatio.length > 0) {
        //这个模型有相同的属性
        tmpRatio = sameRatio[0]
      } else {
        //默认属性第一个比例
        tmpRatio = tmpProperty.RatioList[0]
      }
    } else {
      //默认属性第一个比例
      tmpRatio = tmpProperty.RatioList[0]
    }
    setSelectQuality(tmpProperty)
    setSelectRatio(tmpRatio)

    if (model) {
      setSelectModel(model)
      formRef.current?.setFieldsValue({
        Steps: model.Steps,
        CFG: model.CFG,
        SamplingMethod: model.SamplingMethod,
      })
      setSteps(model.Steps)
      setSelectSamplingMethod(model.SamplingMethod!)
    }
  }
  const totalCost = useMemo(() => {
    if (selectQuality) {
      let v = parseFloat(
        (selectQuality.StepCost * steps * imageCount).toFixed(2)
      )
      return v
    }
    return 0
  }, [selectRatio, imageCount, steps])
  useEffect(() => {
    if (props.drawingParams) {
      setDefaultValues()
    }
  }, [props.drawingParams])
  useEffect(() => {
    if (selectQuality) {
      if (imageCount > selectQuality.MaxImageCount) {
        setImageCount(selectQuality.MaxImageCount)
        formRef.current?.setFieldValue(
          'ImageCount',
          selectQuality.MaxImageCount
        )
      }
    }
  }, [selectRatio])
  function clearImges() {}
  return (
    <>
      <div
        style={{
          height: `calc(100vh - ${isWxEnv ? 0 : 45}px - 60px)`,
          overflow: 'auto',
        }}
      >
        <Form ref={formRef}>
          <Form.Item label="生成模式" name="DrawType" hidden>
            <Selector
              showCheckMark={false}
              options={drawTypes}
              columns={2}
              onChange={(arr, extend) => {
                if (arr.length === 0) {
                  formRef.current?.setFieldValue('DrawType', [selectDrawType])
                } else {
                  if (arr[0] === 0) {
                    clearImges()
                  } else {
                    formRef.current?.setFieldValue(
                      'DenoisingStrength',
                      selectModel?.DenoisingStrength
                    )
                  }
                  setSelectDrawType(arr[0])
                }
              }}
              style={{ '--padding': '4px 6px', fontSize: 12 }}
            />
          </Form.Item>
          <FormItem hidden name={'SourceFileId'}>
            <Input />
          </FormItem>
          <Form.Item
            label={
              <div
                style={{
                  display: 'flex',
                }}
              >
                <span>AI模型</span>
                <div
                  style={{
                    color: 'var(--adm-color-primary)',
                    marginLeft: 'auto',
                  }}
                >
                  <span
                    onClick={() => {
                      setExampleVisible(true)
                    }}
                  >
                    模型绘图案例
                  </span>
                </div>
              </div>
            }
            description={
              <>
                <div>
                  <span>
                    {
                      <>
                        该模型被使用{selectModel?.UsedCount}次，
                        {selectModel?.Description}
                      </>
                    }
                  </span>
                </div>
              </>
            }
          >
            <div style={{ maxHeight: 120, overflow: 'auto' }}>
              <Selector
                columns={4}
                showCheckMark={false}
                options={models}
                value={[selectModelId]}
                onChange={(arr, extend) => {
                  let modelInfo = props.drawingParams?.Models.filter(
                    (m) => m.ModelId === arr[0]
                  )[0]
                  modelChanged(modelInfo)
                }}
                style={{ '--padding': '4px 6px', fontSize: 12 }}
              />
            </div>
          </Form.Item>
          {selectDrawType === 1 && (
            <Form.Item
              label="启发图"
              description="该模式下AI模型将会受到该图的启发并结合输入的文字进行创作，适合草图生成细节图，PS修图等操作"
            >
              <UploadSingleImage
                getToken={getAiDrawingUplodaToAliyunOSSPolicyToken}
                onSelect={() => {
                  formRef.current?.setFieldValue('SourceFileId', '')
                }}
                onDelete={() => {
                  formRef.current?.setFieldValue('SourceFileId', '')
                }}
                onSuccess={(fileInfo) => {
                  formRef.current?.setFieldValue(
                    'SourceFileId',
                    fileInfo.FileId
                  )
                }}
              />
            </Form.Item>
          )}

          <Form.Item
            name="Prompt"
            label={
              <>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span>{'提示词（画面内容）'}</span>
                </div>
              </>
            }
            description={
              <>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    margin: '5px 0',
                  }}
                >
                  <img
                    alt=""
                    src="https://avocado-ai.oss-cn-shenzhen.aliyuncs.com/Images/icon/googleTranslate.ico"
                    style={{ height: 20, marginLeft: 5 }}
                  />
                  <span style={{ fontSize: 12 }}>
                    中文将被谷歌AI翻译成英文，推荐直接使用英文描述！
                  </span>
                </div>
                <div style={{ marginTop: 5, maxHeight: 120, overflow: 'auto' }}>
                  <Selector
                    showCheckMark={false}
                    multiple
                    options={tags}
                    columns={4}
                    value={selectTags}
                    onChange={(arr, extend) => {
                      if (arr.length > 10) {
                        errorMsg('最多选择10个提示词')
                      } else {
                        setSelectTags(arr)
                      }
                    }}
                    style={{ '--padding': '4px 6px', fontSize: 12 }}
                  />
                </div>
              </>
            }
          >
            <TextArea
              maxLength={200}
              style={{ wordBreak: 'break-all' }}
              placeholder={
                selectDrawType === 0
                  ? '例如：一只毕加索风格的小狗,漫画风格/A dog,Picasso style,animation style'
                  : '例如：生成一张动漫图/Animation style'
              }
            />
          </Form.Item>
          <Form.Item
            name="NegativePrompt"
            label={
              <>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span>{'消极提示词（不愿意在画面中出现的）'}</span>
                </div>
              </>
            }
            description={
              <>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    margin: '5px 0',
                  }}
                >
                  <img
                    alt=""
                    src="https://avocado-ai.oss-cn-shenzhen.aliyuncs.com/Images/icon/googleTranslate.ico"
                    style={{ height: 20, marginLeft: 5 }}
                  />
                  <span style={{ fontSize: 12 }}>
                    中文将被谷歌AI翻译成英文，推荐直接使用英文描述！
                  </span>
                </div>
                <div style={{ marginTop: 5, maxHeight: 120, overflow: 'auto' }}>
                  <Selector
                    showCheckMark={false}
                    multiple
                    options={negativeTags}
                    columns={4}
                    value={selectNegativeTags}
                    onChange={(arr, extend) => {
                      if (arr.length > 10) {
                        errorMsg('最多选择10个消极提示词')
                      } else {
                        setSelectNegativeTags(arr)
                      }
                    }}
                    style={{ '--padding': '4px 6px', fontSize: 12 }}
                  />
                </div>
              </>
            }
          >
            <TextArea
              maxLength={200}
              style={{ wordBreak: 'break-all' }}
              placeholder={'例如：丑陋的女孩/ugly girls'}
            />
          </Form.Item>
          <Form.Item
            label={
              <>
                <span>生成图片比例</span>
              </>
            }
            description={
              selectRatio && (
                <span style={{ marginLeft: 10 }}>
                  图片尺寸{selectRatio.Width}X{selectRatio.Height}
                </span>
              )
            }
          >
            <div>
              <Grid columns={6}>
                {ratios.map((m) => (
                  <div
                    key={m.Id}
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <div
                      style={{
                        height: m.ConHeight,
                        width: m.ConWidth,
                        backgroundColor:
                          m.Id === selectRatio?.Id ? '#e7f1ff' : '#eee',
                        color: m.Id === selectRatio?.Id ? '#1677ff' : '#999',
                      }}
                      onClick={() => {
                        setSelectRatio(
                          selectQuality?.RatioList.filter(
                            (m2) => m2.RatioId === m.RatioId
                          )[0]
                        )
                      }}
                    >
                      <div
                        style={{
                          fontSize: 12,
                          lineHeight: m.ConHeight + 'px',
                          textAlign: 'center',
                          width: m.ConWidth,
                        }}
                      >
                        {m.Label}
                      </div>
                    </div>
                  </div>
                ))}
              </Grid>
            </div>
          </Form.Item>
          <Form.Item label="图片质量">
            <Selector
              showCheckMark={false}
              options={qualities}
              columns={3}
              value={[selectQuality?.PropertyId ?? '']}
              onChange={(arr, extend) => {
                if (arr.length !== 0) {
                  setSelectQuality(
                    selectModel?.PropertyList.filter(
                      (m) => m.PropertyId === arr[0]
                    )[0]
                  )
                }
              }}
              style={{ '--padding': '4px 6px', fontSize: 12 }}
            />
          </Form.Item>
          <Form.Item
            name="ImageCount"
            label={
              <>
                <span>图片数量</span>
              </>
            }
            description={
              selectQuality && (
                <>当前参数一次最多生成{selectQuality.MaxImageCount}张图片</>
              )
            }
          >
            <Stepper
              step={1}
              min={1}
              max={selectQuality?.MaxImageCount ?? 1}
              onChange={(val) => {
                setImageCount(val)
              }}
            />
          </Form.Item>
          <Form.Item label="艺术家">
            <div style={{ maxHeight: 120, overflow: 'auto' }}>
              <Selector
                showCheckMark={false}
                options={artists}
                columns={5}
                multiple
                value={selectArtist}
                onChange={(arr, extend) => {
                  if (arr.length > 3) {
                    errorMsg('最多选择3个艺术家')
                  } else {
                    setSelectArtist(arr)
                  }
                }}
                style={{ '--padding': '4px 6px', fontSize: 12 }}
              />
            </div>
          </Form.Item>
          <Form.Item label="风格">
            <div style={{ maxHeight: 120, overflow: 'auto' }}>
              <Selector
                showCheckMark={false}
                options={styles}
                value={selectStyle}
                columns={5}
                multiple
                onChange={(arr, extend) => {
                  if (arr.length > 3) {
                    errorMsg('最多选择3种风格')
                  } else {
                    setSelectStyle(arr)
                  }
                }}
                style={{ '--padding': '4px 6px', fontSize: 12 }}
              />
            </div>
          </Form.Item>
          <Form.Item
            label={
              <>
                <span>步数</span>
                {selectQuality && (
                  <span style={{ marginLeft: 5 }}>
                    {selectQuality.StepCost}/步
                  </span>
                )}
              </>
            }
            name="Steps"
            description="一般情况步长越大，图片细节更多，但图片生成越慢。"
          >
            <Slider
              step={1}
              max={100}
              min={20}
              popover
              onChange={(val) => {
                setSteps(parseInt(val.toString()))
              }}
            />
          </Form.Item>
          <Form.Header>高级参数</Form.Header>
          <Form.Item
            label="种子"
            initialValue={'-1'}
            extra={
              <Button
                size="mini"
                onClick={() => {
                  formRef.current?.setFieldValue(
                    'Seed',
                    Math.round(Math.random() * 10000000)
                  )
                }}
              >
                随机
              </Button>
            }
            name="Seed"
            description="-1表示每次随机生成一个种子，相同的种子在描述相同时，生成的图片基本一致"
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="脸部操作"
            name="RestoreFaces"
            description={
              selectRestoreFaces === 1 &&
              '如果图片中存在脸部，AI会优化脸部的生成'
            }
          >
            <Selector
              showCheckMark={false}
              options={restroreFaces}
              columns={2}
              onChange={(arr, extend) => {
                if (arr.length === 0) {
                  formRef.current?.setFieldValue('RestoreFaces', [
                    selectRestoreFaces,
                  ])
                } else {
                  if (arr[0] === 0) {
                    clearImges()
                  }
                  setSelectRestoreFaces(arr[0])
                }
              }}
              style={{ '--padding': '4px 6px', fontSize: 12 }}
            />
          </Form.Item>
          <Form.Item
            label="采样方法"
            name="SamplingMethod"
            description="可能特定方法效果更好，一般情况使用默认"
            onClick={() => {
              setSamplingMethodsVisible(true)
            }}
          >
            <Input readOnly />
          </Form.Item>
          {selectDrawType === 1 && (
            <Form.Item
              label="启发图相似度"
              name="DenoisingStrength"
              description="生成的图片与启发图的相似度"
            >
              <Slider step={0.01} max={1} min={0} popover />
            </Form.Item>
          )}
          <Form.Item
            label="CFG"
            name="CFG"
            description="相似度，越大生成的图片和模型训练数据越相似"
          >
            <Slider step={1} max={20} min={1} popover />
          </Form.Item>
        </Form>
        <Picker
          columns={samplingMethods}
          visible={samplingMethodsVisible}
          value={[selectSamplingMethod]}
          onClose={() => {
            setSamplingMethodsVisible(false)
          }}
          onConfirm={(v) => {
            formRef.current?.setFieldValue('SamplingMethod', v[0]!)
            setSelectSamplingMethod(v[0]!)
          }}
        />
      </div>
      <div style={{ padding: 10 }}>
        <Button block color="primary" shape="rounded" onClick={submit}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span>开始绘图</span>
            {totalCost > 0 ? (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span>
                  ，需消耗
                  <span style={{ marginLeft: 2 }}>{totalCost}</span>
                </span>
                <Avocado />
              </div>
            ) : (
              <></>
            )}
          </div>
        </Button>
      </div>
      <Popup
        visible={exampleVisible}
        onMaskClick={() => {
          setExampleVisible(false)
        }}
        bodyStyle={{
          borderTopLeftRadius: '8px',
          borderTopRightRadius: '8px',
          minHeight: '95vh',
        }}
      >
        <div
          style={{
            fontSize: 18,
            lineHeight: '30px',
            textAlign: 'center',
            position: 'relative',
            color: '#666',
          }}
        >
          {selectModel?.ModelName}绘图案例
          <span style={{ position: 'absolute', right: 10, top: 0 }}>
            <CloseOutline
              onClick={() => {
                setExampleVisible(false)
              }}
            />
          </span>
        </div>
        <div
          style={{ height: 'calc(95vh - 50px)', overflow: 'auto', padding: 10 }}
        >
          {selectModel && exampleVisible && (
            <ModelExamples ModelId={selectModel.ModelId} />
          )}
        </div>
      </Popup>
    </>
  )
}
interface IModelExamples {
  ModelId: string
}
interface IQueryResult {
  dataList: DrawingPictureDetailInfoVM[]
  hasMore: boolean
}
function ModelExamples(props: IModelExamples) {
  let initQuery: any = {
    Page: 1,
    Limit: 20,
    ModelId: props.ModelId,
  }
  const [queryResult, setQueryResult] = useState<IQueryResult>({
    dataList: [],
    hasMore: false,
  })
  let [queryParams, setQueryParams] = useState<DrawingPictureQuery>(initQuery)

  async function loadData() {
    let res = await getModelExamples(queryParams!, true)
    if (res.IsSuccess) {
      setQueryResult({
        dataList: combineTwoList(
          queryResult!.dataList!,
          res.Result!,
          'PictureId'
        ),
        hasMore: res.Result!.length >= queryParams.Limit!,
      })
      let newQueryParams = { ...queryParams, Page: queryParams.Page! + 1 }
      setQueryParams(newQueryParams)
    } else {
      errorMsg(res.Message)
      throw new Error()
    }
  }
  useEffect(() => {
    refresh()
  }, [props.ModelId])

  async function refresh() {
    setQueryParams({
      ...initQuery,
    })
    setQueryResult({ dataList: [], hasMore: true })
  }
  return (
    <>
      <div style={{ height: '100%', backgroundColor: 'white' }}>
        {queryResult.dataList.map((m, index) => (
          <div key={m.PictureId} style={{ marginBottom: 10 }}>
            <div style={{ display: 'flex' }}>
              <div>
                <Avatar src={m.Header} />
              </div>
              <div style={{ marginLeft: 10 }}>
                <div style={{ color: '#999' }}>{m.Name}</div>
                <Ellipsis content={m.Prompt} rows={2} />
              </div>
            </div>
            <div style={{ marginTop: 8 }}>
              <img alt="" src={m.Url} style={{ width: '100%' }} />
            </div>
          </div>
        ))}
        {(queryResult.hasMore || queryResult.dataList.length > 0) && (
          <>
            <InfiniteScroll loadMore={loadData} hasMore={queryResult.hasMore} />
          </>
        )}
        {!queryResult.hasMore && queryResult.dataList.length === 0 && (
          <>
            <ErrorBlock
              image={
                'https://avocado-ai.oss-cn-shenzhen.aliyuncs.com/Images/empty.png'
              }
              style={{
                '--image-height': '150px',
                marginTop: 40,
              }}
              title="当前模型暂时没有案例"
              description={<>晚点再来看看吧</>}
            />
          </>
        )}
      </div>
    </>
  )
}
