/*
    This component renders a text box
    and an input form above the text box that
    enables a user to input a link

    also enables user to edit the title
*/

/*
    function components can not be given refs - if given ref
    use forward ref
*/
import { useState } from "react";
import * as Y from "yjs";

const Link = ({ document, updateElement }) => {
  const [text, setText] = useState(document.get('text').toString());
  const [link, setLink] = useState(document.get('link').toString());
  const [isEditing, setIsEditing] = useState(document.get('link') === '');

  const handleSave = () => {
    // update text & link
    const id = document.get("id");
    const yText = new Y.Text()
    const yLink = new Y.Text()
    yText.insert(0, text)
    yLink.insert(0, link)
    document.set("text", yText);
    document.set("link", yLink);
    setIsEditing(false);
    updateElement(id, document);
  };

  const renderLink = () => {
    console.log('rendering',document.get("link").toString())
    return <div onClick={() => setIsEditing(true)}>
      <a href={document.get("link").toString()}>
        {document.get("text").toString()}
      </a>
      <button onClick={() => setIsEditing(true)}>Edit</button>
    </div>
  };

  const renderEditForm = () => {
    return (
      <div>
        <label>Text</label>
        <input value={text} onChange={(e) => setText(e.target.value)}></input>
        <label>Link</label>
        <input value={link} onChange={(e) => setLink(e.target.value)}></input>
        <button onClick={handleSave}>Save</button>
      </div>
    );
  };

  return isEditing ? renderEditForm() : renderLink();
};

export default Link;
