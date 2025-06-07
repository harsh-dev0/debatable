declare module "@editorjs/header" {
  interface HeaderData {
    text: string
    level: number
  }

  export default class Header {
    static get toolbox(): {
      icon: string
      title: string
    }
    constructor({ data, config, api }: any)
    render(): HTMLElement
    save(blockContent: HTMLElement): HeaderData
    validate(savedData: HeaderData): boolean
  }
}
