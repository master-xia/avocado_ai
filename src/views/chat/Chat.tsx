// import { createConversation, sendMessage } from '@api/chat'
// import { PageHeader } from '@components/common/PageHeader'
// import { useAppDispatch, useAppSelector } from '@store/hooks'
// import { updateUserStatusAsync } from '@store/modules/auth'
// import { updateConversationInfoAsync } from '@store/modules/converstaion'
// import { redirectToLogin } from '@utils/auth'
// import { copyText, errorMsg, formatDate, successMsg } from '@utils/common'
// import {
//   Dialog,
//   DotLoading,
//   Ellipsis,
//   Form,
//   Input,
//   List,
//   TextArea,
//   TextAreaRef,
// } from 'antd-mobile'
// import { RightOutline } from 'antd-mobile-icons'
// import { FormInstance } from 'rc-field-form'
// import { useEffect, useRef, useState } from 'react'
// import { useNavigate } from 'react-router-dom'

// export default function HomeIndex() {
//   let [msg, setMsg] = useState('')
//   let textRef = useRef<TextAreaRef>(null)
//   let loginStatus = useAppSelector((state) => state.auth.loginStatus)
//   let chatPanelRef = useRef<HTMLDivElement>(null)
//   let formRef = useRef<FormInstance>(null)
//   let formRef2 = useRef<FormInstance>(null)
//   let conversationStatus = useAppSelector((m) => m.auth.status.ConversationInfo)
//   let hasUnpaidOrder = useAppSelector((m) => m.auth.status.HasUnpaidOrder)
//   let conversationInfo = useAppSelector(
//     (state) => state.chat.conversationInfoVM
//   )
//   let introduceMsg =
//     '您好，我是基于ChatGPT的智能机器人，ChatGPT目前仍以文字方式互动，而除了可以透过人类自然对话方式进行交互，还可以用于相对复杂的语言工作，包括自动文本生成、自动问答、自动摘要等在内的多种任务。如：在自动文本生成方面，ChatGPT可以根据输入的文本自动生成类似的文本（剧本、歌曲、企划等），在自动问答方面，ChatGPT可以根据输入的问题自动生成答案。还具有编写和调试计算机程序的能力。'
//   let dispatch = useAppDispatch()
//   let navigate = useNavigate()

//   useEffect(() => {
//     scrollToEnd()
//   }, [conversationInfo])
//   //判断对话状态，如果改变了就重新拉取
//   useEffect(() => {
//     if (conversationStatus?.Status === 1) {
//       dispatch(updateConversationInfoAsync())
//     }
//   }, [conversationStatus?.Status])
//   useEffect(() => {
//     if (loginStatus) {
//       dispatch(updateConversationInfoAsync())
//     }
//   }, [loginStatus])
//   let textareaCacheKey = 'chat_textarea_cache'
//   useEffect(() => {
//     updateMsg(localStorage.getItem(textareaCacheKey) ?? '')
//   }, [])
//   function updateMsg(msg: string) {
//     if (msg) {
//       localStorage.setItem(textareaCacheKey, msg)
//     } else {
//       localStorage.removeItem(textareaCacheKey)
//     }
//     formRef.current?.setFieldValue('msg', msg)
//     setMsg(msg)
//   }

//   function newChat() {
//     if (!loginStatus) {
//       redirectToLogin()
//       return
//     }
//     Dialog.confirm({
//       title: '新对话',
//       content: (
//         <div>
//           <div>
//             <Form ref={formRef2}>
//               <Form.Item
//                 name="Title"
//                 label="标题"
//                 initialValue={
//                   '个人对话' + formatDate(new Date(), 'yyyy-MM-dd hh:mm')
//                 }
//               >
//                 <Input placeholder="请输入对话标题" />
//               </Form.Item>
//               <Form.Item name="RoleDescription" label="ChatGPT角色描述">
//                 <TextArea
//                   maxLength={200}
//                   rows={3}
//                   placeholder="请输入ChatGPT的角色描述"
//                   showCount
//                 />
//               </Form.Item>
//             </Form>
//           </div>
//           <div style={{ wordBreak: 'break-all', fontSize: 14, marginTop: 10 }}>
//             <div>
//               ChatGPT会根据聊天上下文和用户进行的角色描述进行回答，为了更加精确的回答您的问题，您可以开启一个新的对话，并尽可能的描述您需要的角色信息。
//             </div>
//             <div style={{ color: 'var(--adm-color-danger)' }}>
//               最好描述ChatGPT的角色，不指定角色的话ChatGPT会根据聊天上下文自动分析。
//             </div>
//           </div>
//         </div>
//       ),
//       confirmText: '开启新对话',
//       afterShow: () => {
//         formRef2?.current?.setFieldValue(
//           'RoleDescription',
//           '你是一个十分智能的助手'
//         )
//       },
//       onConfirm: () => {
//         var value = formRef2?.current?.getFieldsValue()
//         createConversation(value, false).then((res) => {
//           if (res.IsSuccess) {
//             update()
//           } else {
//             errorMsg(res.Message)
//           }
//         })
//       },
//     })
//   }

//   function scrollToEnd() {
//     window.setTimeout(() => {
//       if (chatPanelRef.current) {
//         chatPanelRef.current!.scrollTop = chatPanelRef.current!.scrollHeight
//       }
//     }, 50)
//   }
//   function sendMsg() {
//     if (!loginStatus) {
//       redirectToLogin()
//       return
//     }
//     if (!conversationInfo) {
//       newChat()
//       return
//     }
//     let content = msg
//     function send() {
//       updateMsg('')
//       localStorage.removeItem(textareaCacheKey)
//       sendMessage({
//         Content: content,
//         ConversationId: conversationInfo?.ConversationId ?? null,
//       }).then((res) => {
//         if (!res.IsSuccess) {
//           updateMsg(content)
//           if (res.Code !== 40001) {
//             errorMsg(res.Message)
//           }
//         } else {
//           successMsg('发送成功')
//           //立刻更新一下状态
//           update()
//         }
//       })
//     }
//     let remainCount = conversationInfo!.RemainTokenCount - msg.length * 2
//     if (remainCount < 300) {
//       Dialog.confirm({
//         title: '提示',
//         content: `由于ChatGPT会根据聊天上下文进行回答，并且单个聊天上下文大概最多支持4096英文单词或2048汉字，当前聊天回答字数剩余${remainCount}英文单词或${(
//           remainCount / 2
//         ).toFixed(0)}汉字，本次回答可能无法成功，或返回的对话信息不完整。`,
//         confirmText: '新建对话',
//         cancelText: '继续发送',
//         onConfirm: async () => {
//           newChat()
//         },
//         onCancel: () => {
//           send()
//         },
//       })
//     } else {
//       send()
//     }
//   }
//   function update() {
//     dispatch(updateConversationInfoAsync())
//     dispatch(updateUserStatusAsync(true))
//   }
//   return (
//     <>
//       <div
//         style={{ height: '100%', overflow: 'hidden', background: '#f5f5f5' }}
//       >
//         <PageHeader
//           showBack={false}
//           title={
//             <>
//               <div
//                 onClick={() => {
//                   navigate('/chat/list/chat')
//                 }}
//               >
//                 <Ellipsis
//                   content={
//                     conversationInfo ? conversationInfo.Title ?? '无标题' : ''
//                   }
//                 />
//               </div>
//             </>
//           }
//           right={
//             <>
//               <span onClick={newChat}>新的对话</span>
//             </>
//           }
//           backgroundColor="#f5f5f5"
//         />
//         {hasUnpaidOrder && (
//           <div
//             style={{
//               textAlign: 'center',
//               backgroundColor: 'var(--adm-color-danger)',
//               color: 'white',
//               lineHeight: '30px',
//             }}
//             onClick={() => {
//               navigate('/order/buy')
//             }}
//           >
//             存在一笔未支付的订单，立即支付
//             <span style={{ position: 'absolute', right: 10 }}>
//               <RightOutline />
//             </span>
//           </div>
//         )}
//         <div
//           style={{
//             height: hasUnpaidOrder
//               ? 'calc(100% - 165px)'
//               : 'calc(100% - 135px)',
//             overflow: 'auto',
//             borderTop: '1px solid #ccc',
//           }}
//           ref={chatPanelRef}
//         >
//           <List className="messageList">
//             {(!loginStatus ||
//               !conversationInfo ||
//               conversationInfo.Messages.length === 0) && (
//               <MessageItem
//                 Message={introduceMsg}
//                 isChatGPT={true}
//                 showCopyBtn={false}
//               />
//             )}
//             {conversationInfo?.RoleDescription && (
//               <MessageItem
//                 Message={conversationInfo?.RoleDescription}
//                 isChatGPT={false}
//               />
//             )}
//             {conversationInfo?.Messages.map((item, index) => (
//               <MessageItem
//                 Message={item.Content}
//                 isChatGPT={item.IsChatGpt}
//                 key={index}
//                 showCopyBtn={item.ShowCopy}
//                 messageStatus={item.Status}
//               />
//             ))}
//           </List>
//           {conversationStatus && conversationStatus?.Status !== 1 && (
//             <div style={{ textAlign: 'center', marginBottom: 10 }}>
//               {conversationStatus.Status === 2 && '已加入ChatGPT等待队列'}
//               {conversationStatus.Status === 3 && 'ChatGPT正在思考你的问题'}
//               <DotLoading />
//             </div>
//           )}
//         </div>
//         <div>
//           <Form ref={formRef}>
//             <Form.Item
//               name="msg"
//               style={{ background: '#f5f5f5', borderTop: '1px solid #ccc' }}
//               extra={
//                 msg ? (
//                   <span
//                     className="iconfont icon-fasong"
//                     style={{ fontSize: 20, color: 'var(--adm-color-primary)' }}
//                     onClick={sendMsg}
//                   ></span>
//                 ) : (
//                   <span
//                     className="iconfont icon-fasong"
//                     style={{ fontSize: 20 }}
//                   ></span>
//                 )
//               }
//             >
//               <TextArea
//                 maxLength={500}
//                 rows={3}
//                 placeholder="请输入聊天内容"
//                 onChange={(val) => {
//                   updateMsg(val)
//                 }}
//                 ref={textRef}
//               />
//             </Form.Item>
//           </Form>
//         </div>
//       </div>
//       <style>
//         {`
//         .messageList{
//           --border-inner:none;
//           border:none;
//           --border-bottom:none;
//         }
//         `}
//       </style>
//     </>
//   )
// }
// interface IMessageItemProps {
//   Message: string | JSX.Element
//   isChatGPT: boolean
//   showCopyBtn?: boolean
//   messageStatus?: number
// }
// function MessageItem(props: IMessageItemProps) {
//   let userInfo = useAppSelector((state) => state.auth.userInfo)
//   let chatGPTHeader =
//     'https://aiquyin-static-beijing.oss-cn-beijing.aliyuncs.com/ChatGPT/chatgpt.png?x-oss-process=style/jmms'
//   let copyEle =
//     props.isChatGPT &&
//     (props.showCopyBtn === undefined || props.showCopyBtn) ? (
//       <div style={{ display: 'flex', marginLeft: 'auto', marginRight: 5 }}>
//         <span
//           className="iconfont icon-fuzhi"
//           style={{
//             color: 'var(--adm-color-primary)',
//             display: 'flex',
//             alignSelf: 'center',
//           }}
//           onClick={() => {
//             copyText(props.Message as string)
//           }}
//         ></span>
//       </div>
//     ) : (
//       <></>
//     )
//   let headerEle = (
//     <div style={{ display: 'flex', width: 40, justifyContent: 'center' }}>
//       <img
//         style={{ height: 30, width: 30, borderRadius: '50%' }}
//         src={props.isChatGPT ? chatGPTHeader : userInfo?.Header ?? ''}
//         alt="header"
//       />
//     </div>
//   )
//   let messageEle = (
//     <div
//       style={{
//         backgroundColor: props.isChatGPT
//           ? 'rgba(255,255,255,0.7)'
//           : 'rgba(153,232,105,0.7)',
//         borderRadius: 10,
//         display: 'flex',
//       }}
//     >
//       <div
//         style={{
//           padding: 10,
//           wordBreak: 'break-all',
//           color: 'var(--adm-color-text)',
//         }}
//       >
//         {props.Message}
//       </div>
//       {copyEle}
//     </div>
//   )
//   return (
//     <>
//       {props.isChatGPT ? (
//         <List.Item
//           style={{
//             backgroundColor: '#f5f5f5',
//           }}
//           className="messageItem"
//         >
//           <div style={{ display: 'flex' }}>
//             <div>{headerEle}</div>
//             <div>{messageEle}</div>
//           </div>
//         </List.Item>
//       ) : (
//         <List.Item
//           style={{
//             backgroundColor: '#f5f5f5',
//           }}
//           className="messageItem"
//         >
//           <div style={{ display: 'flex' }}>
//             <div style={{ marginLeft: 'auto' }}>
//               <div>{messageEle}</div>
//               {props.messageStatus === 4 && (
//                 <>
//                   <div
//                     style={{ fontSize: 14, color: 'var(--adm-color-danger)' }}
//                   >
//                     回答失败，失败原因查看消息通知
//                   </div>
//                 </>
//               )}
//             </div>

//             <div>{headerEle}</div>
//           </div>
//         </List.Item>
//       )}
//     </>
//   )
// }
