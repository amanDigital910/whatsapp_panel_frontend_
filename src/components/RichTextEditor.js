import { useEffect, useRef, useState } from 'react';
import Editor, { BtnBold, BtnItalic, BtnUnderline, BtnBulletList, BtnNumberedList, BtnStrikeThrough, BtnUndo, BtnRedo, BtnClearFormatting, Toolbar } from 'react-simple-wysiwyg';
import './style.css'

export default function CustomEditor() {
    const [value, setValue] = useState('');
    const editorRef = useRef(null);

    function onChange(e) {
        setValue(e.target.value);
    }

    console.log("Editors ", value);


    useEffect(() => {
        const iframe = editorRef.current?.querySelector('iframe');
        const resizeEditor = () => {
            if (iframe && iframe.contentDocument?.body) {
                const contentHeight = iframe.contentDocument.body.scrollHeight;
                iframe.style.height = `${Math.max(100, contentHeight)}px`;
            }
        };

        const interval = setInterval(resizeEditor, 300);
        return () => clearInterval(interval);
    }, [value]);

    return (
        <div ref={editorRef} className='bg-white h-full rounded-md'>
            <Editor value={value} placeholder='Enter your Message' onChange={onChange} className='h-[368px] w-full pl-3 overflow-auto border rounded-b-md border-black'>
                <Toolbar className="w-full flex justify-end rounded-t-md border-b-0 border-t-[1px] border-x-[1px] pl-3 text-black border-black">
                    <BtnRedo />
                    <BtnUndo />
                    <BtnClearFormatting />
                    <BtnBold />
                    <BtnItalic />
                    <BtnUnderline />
                    <BtnStrikeThrough />
                    <BtnNumberedList />
                    <BtnBulletList />
                </Toolbar>
            </Editor>
        </div>
    );
}
