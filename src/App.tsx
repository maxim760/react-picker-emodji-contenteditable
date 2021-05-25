import React, { useRef, useState } from "react";
import useOutsideClick from "./hooks/useOutsideClick";
import Picker, { IEmojiData } from 'emoji-picker-react';
import "emoji-mart/css/emoji-mart.css";
import ContentEditable, { ContentEditableEvent } from 'react-contenteditable'
import { ReactComponent as IconEmoji } from "./icons/smile.svg";
import {pasteImgAtCaret } from "./utils/selection";


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


// todo: onPaste для одычных инпутов, мб через копибоард ??
  const onPasteInput = async (event: React.ClipboardEvent<HTMLInputElement>) => {
    // Get pasted data via clipboard API
    const clipboardData = event.clipboardData || (window as any).clipboardData;
    const pastedData = clipboardData.getData('Text');
    console.log(pastedData, "pastedData");
    console.log(clipboardData, "clipBOardData");
    // console.dir(navigator.clipboard)
    const readData = await (navigator.clipboard as IClipboard).read()
    console.log(readData.items)
    console.log(readData)
  }
  return (
    <div className="app">
      <input onPaste={onPasteInput} />
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
