import { Editor } from "@tinymce/tinymce-react";
import { useEffect, useRef, useState } from "react";

const TextEditor = ({ label, onChange, setField, values, ...props }) => {
  const { name } = props;
  const editorRef = useRef(null);
  const [content, setContent] = useState("");
  const log = () => {
    if (editorRef.current) {
      console.log(editorRef.current.getContent());
    }
  };

  useEffect(() => {
    if (onChange !== undefined) {
      onChange(content);
    }
  }, [content]);

  const handleEditorChange = (e) => {
    // let str = e.target.getContent();
    // let result = str.replace(/(<p[^>]+?>|<p>|<\/p>|&nbsp;)/gim, "");
    
    setField(`${name}`, e.target.getContent());
    setContent(e.target.getContent());
  };

  // return (
  //   <>
  //     <label className="pb-5">{label}</label>
  //     <Editor
  //       apiKey="my-api-key"
  //       onInit={(evt, editor) => (editorRef.current = editor)}
  //       initialValue={values && values[name]}
  //       init={{
  //         height: 400,
  //         menubar: false,
  //         plugins: [
  //           "advlist autolink lists link image charmap print preview anchor",
  //           "searchreplace visualblocks code fullscreen",
  //           "insertdatetime media table paste code help wordcount",
  //         ],
  //         toolbar:
  //           "undo redo | formatselect | " +
  //           "bold italic backcolor | alignleft aligncenter " +
  //           "alignright alignjustify | bullist numlist outdent indent | " +
  //           "removeformat | help",
  //         content_style:
  //           "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
  //       }}
  //       onChange={handleEditorChange}
  //       {...props}
  //       name={name}
  //     />
  //   </>
  // );


  return (
    <>
    <label className="pb-5">{label}</label>
      <Editor
        apiKey='my-api-key'
        onInit={(evt, editor) => editorRef.current = editor}
        initialValue={values && values[name]}
        init={{
          height: 500,
          menubar: false,
          plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
          ],
          toolbar: 'undo redo | blocks | ' +
            'bold italic forecolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'removeformat | help',
          content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
        }}
        onChange={handleEditorChange}
        {...props}
        name={name}
      />
     
    </>
  );
};

export default TextEditor;
