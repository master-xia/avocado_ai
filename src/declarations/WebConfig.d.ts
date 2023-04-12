declare module 'WebConfig' {
  const WebConfig: IWebConfig
  export default WebConfig
}
interface IWebConfigHost {
  api: string
}
declare interface IWebConfig {
  host: IWebConfigHost
}
