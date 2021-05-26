import React, { useRef, useState } from "react";
import useOutsideClick from "./hooks/useOutsideClick";
import Picker, { IEmojiData } from 'emoji-picker-react';
import "emoji-mart/css/emoji-mart.css";
import ContentEditable, { ContentEditableEvent } from 'react-contenteditable'
import { ReactComponent as IconEmoji } from "./icons/smile.svg";
import {pasteImgAtCaret } from "./utils/selection";
import { getIconFromSrc } from "./utils/getIconFromSrc";


const MAX_HEIGHT = 196;
const style = {
  position: "absolute",
  zIndex: "999",
  left: "50%",
  transform: "translateX(-50%)",
  bottom: "calc(100% + 44px)",
};

type IClipboardItems = {
  items: any[]
}

type IClipboard = Clipboard & { read(): Promise<IClipboardItems> }


export const App = () => {
  const inputRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);
  const [isShowPicker, setIsShowPicker] = useState(false);
  const blockRef = useRef<HTMLDivElement>(null);
  const onShowPicker = () => {
    setIsShowPicker(true);
  };

  const onClosePicker = () => {
    setIsShowPicker(false);
  };
  useOutsideClick<HTMLDivElement>(blockRef, onClosePicker);

  const onClickEmoji = (event: React.MouseEvent, emojiData: IEmojiData ) => {
    pasteImgAtCaret({name: emojiData.unified, element: inputRef.current!})
    setHtml(inputRef.current!.innerHTML)
  };

  const [html, setHtml] = useState<string>("")
  const onChange = (e: ContentEditableEvent) => {
    const value = e.target.value
    setHtml(value)
    setHeight(inputRef.current?.getBoundingClientRect().height as number);
  };

  const [textValue, setTextValue] = useState("")
  const onChangeText: (arg: React.ChangeEvent<HTMLInputElement>) => void = (event) => {
    setTextValue(event.target.value)
  }
  const onPasteInput = async (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault()
    const clipboardData = event.clipboardData || (window as any).clipboardData;
    const el = document.createElement("html")
    el.innerHTML = clipboardData.getData("text/html")
    const result = Array.from(el.querySelector("body")!.querySelectorAll("body *")).map((element) => {
      if (element.tagName == "IMG" && (element as HTMLImageElement).src.startsWith("https://cdn.jsdelivr.net/npm/emoji-datasource-apple@6.0.1/img")) {
        const icon = getIconFromSrc((element as HTMLImageElement).src)
        return icon ? icon : element.textContent
      }
      return element.textContent
    })
    // console.log(result)
    setTextValue(result.join("") || clipboardData.getData("text/html"))
  }
  return (
    <div className="app">
      <input onPaste={onPasteInput} onChange={onChangeText} value={textValue} />
      <div className="inputWrapper">
        <ContentEditable
          id="emoji-picker"
          placeholder="Введите сообщение"
          onChange={onChange}
          className={`input ${height >= MAX_HEIGHT ? "scroll" : ""}`}
          innerRef={inputRef}
          tagName="div"
          html={html}
        />
        <div ref={blockRef} className="btnsBlock">
          <button className="button" onClick={onShowPicker}>
            <IconEmoji className="icon" />
          </button>
          <div  className={"pickerWrapper"}>
          {isShowPicker && (
              <Picker
                disableSearchBar={true}
                disableSkinTonePicker={true}
                onEmojiClick={onClickEmoji}
                pickerStyle={style}
                native={false}
                disableAutoFocus={true}
          />
          )}
        </div>
        </div>
      </div>
    </div>
  );
};
