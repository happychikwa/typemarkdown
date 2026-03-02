"use client";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { headingsPlugin, MDXEditorMethods, setMarkdown$ } from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";
import dynamic from "next/dynamic";
import React from "react";
import { v4 as uuidv4 } from "uuid";

const MDXEditor = dynamic(
  () => import("@mdxeditor/editor").then((mod) => mod.MDXEditor),
  {
    ssr: false,
  }
);

const editor = () => {
  //Markdown ref
  const ref = React.useRef<MDXEditorMethods>(null);
  const [isPending, setIsPending] = useState(true)
  const [title, setTitle] = useState<string>("");
  const [fileList, setFileList] = useState<any[]>([]);
  const [savedNote, setSavedNote] = useState<any[]>([]);
  const [content, setContent] = useState<string>("");


  const handleInput = async () => {
    const content = ref.current?.getMarkdown();
    const file_id = uuidv4();
    const date = new Date().toLocaleDateString();
    const file = {
      file_id: file_id,
      file_title: title,
      content: content,
      created_at: date,
      updated_at: date,
    };
    try {
      const data = await supabase.from("file").insert(file);
      alert("File Saved");
    } catch (error) {
      alert("Failed to Save");
      console.log(error);
    }
  };

  const loadFile = async (file_id: String) => {
    try {
      const file = await supabase.from("file").select().eq("file_id", file_id);
      if (file.statusText != "OK") setSavedNote([]);
      setSavedNote(file.data ?? []);
      if(file.data && file.data.length > 0) {
        setTitle(file.data[0].file_title)
        setContent(file.data[0].content)
        if(ref.current){
          ref.current?.setMarkdown(file.data[0].content)
      }
      }
      setIsPending(false)
    } catch (error) {
      setSavedNote([]);
    }
  };

  useEffect(() => {
    // You may want to call loadFile here if needed on mount
  }, []);

  useEffect(() => {
    const name = async () => {
      try {
        const fileList = await supabase.from("file").select().range(0, 20);
        setFileList(fileList.data ?? []);
      } catch (error) {
        setFileList([]);
      }
    };
    name();
  }, []);


  return (
    <main className="h-dvh w-full flex justify-content items-center min-h-screen border-5 border-blue-500">
      <div className="h-9/10 w-full flex justify-between mr-10 ml-10 border-5 border-green-500">
        <div className="w-1/3 justify-content flex-row p-3 border-5 border-red-500">
          <ul>
            {
            fileList.map((file) => (
              <li
                className="hover:bg-gray-900 p-2"
                key={file.file_id}
                onClick={() => loadFile(file.file_id)}
              >
                {file.file_title}
              </li>
            ))
            }
          </ul>
        </div>
        <div className="flex-row w-3/4 max-w-screen-lg border-pink-800 border-5 flex-row">
          <div className="h-9/10 border-5">
            <input
                    id="markdowntitle"
                    className="w-full p-1"
                    type="text"
                    title="Enter Title ..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                ></input>
                
                <MDXEditor
                  ref={ref}
                  markdown={content}
                  onChange={setContent}
                  plugins={[headingsPlugin()]}
                />
            </div>
          <div
            className="border-5 bg-blue-500 hover:bg-blue-800"
            onClick={() => handleInput()}
          >
            SAVE
          </div>
        </div>
      </div>
    </main>
  );
};

export default editor;
