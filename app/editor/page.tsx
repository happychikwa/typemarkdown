'use client'
import { useEffect, useState, useRef } from "react";
import {supabase} from '@/lib/supabase'
import { headingsPlugin, MDXEditorMethods } from "@mdxeditor/editor";
import '@mdxeditor/editor/style.css'
import dynamic from 'next/dynamic'
import React from "react";

const editor = () => {

    const MDXEditor = dynamic(() => import('@mdxeditor/editor').then(mod => mod.MDXEditor),
    {
        ssr: false
    })
    //Markdown ref
    const ref = React.useRef<MDXEditorMethods>(null)
    const editorRef = useRef<HTMLDivElement>(null);
    const [content,setContent] = useState<string>('');

    const handleInput = async () => {
            const text = ref.current?.getMarkdown();
            let title = document.getElementById('markdowntitle')?.value;
            console.log("title :",title?.innerText)         
            // console.log("title :",title)
            // console.log("text :",text)
        // const {data, error} = await supabase.from('file').insert([{fileContent}]);
        // if(error) console.error("Failed to save:", error)
        //     else console.log("saved", fileContent)
    }



    return(
        <main className=" w-full flex justify-content items-center min-h-screen">
            <div className="w-full flex justify-between mr-10 ml-10">
                <div className="w-1/3 justify-content flex-row bg-yellow-500 p-3">
                    Files
                    <ul>
                        <li>Hello World</li>
                        <li>python</li>
                    </ul>
                </div>
                <div className="w-3/4 max-w-screen-lg bg-green-800 flex-row" >
                    <input id="markdowntitle" className="w-full" ></input>
                    <MDXEditor ref={ref} markdown={''} plugins={[headingsPlugin()]} />
                </div>
                    <div className="bg-blue-500 hover:bg-blue-800" 
                    onClick={() => handleInput()}

                >SAVE</div>
                </div>
        </main>
    )
}

export default editor;