import { useEffect, useRef, useState } from 'react';
import Editor, { BtnBold, BtnItalic, BtnUnderline, BtnBulletList, BtnNumberedList, BtnStrikeThrough, BtnUndo, BtnRedo, BtnClearFormatting, Toolbar } from 'react-simple-wysiwyg';

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
        <div ref={editorRef}>
            <div
                className="prose"
                dangerouslySetInnerHTML={{ __html: value }}
            />
            <Editor value={value} onChange={onChange} className='min-h-40 w-full overflow-auto max-h-96 h-full'>
                <Toolbar className="w-full flex justify-end rounded-xl text-black">
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
