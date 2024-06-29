import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./EditNote.css";

function EditNote() {
  const { id } = useParams();
  const [noteText, setNoteText] = useState("");
  const [originalNoteText, setOriginalNoteText] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageAuthor, setImageAuthor] = useState("");
  const [imageAuthorLink, setImageAuthorLink] = useState("");

  useEffect(() => {
    fetch(`http://localhost:3000/notes/${id}`)
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          setNoteText(data.text || "");
          setOriginalNoteText(data.text || "");
          setImageUrl(data.imageUrl || "");
          setImageAuthor(data.imageAuthor || "");
          setImageAuthorLink(data.imageAuthorLink || "");
        }
      })
      .catch((error) => console.error("Error fetching note:", error));
  }, [id]);

  const handleUpdate = (updatedImageUrl, updatedImageAuthor, updatedImageAuthorLink) => {
    const updatedNote = {
      text: noteText,
      imageUrl: updatedImageUrl || imageUrl,
      imageAuthor: updatedImageAuthor || imageAuthor,
      imageAuthorLink: updatedImageAuthorLink || imageAuthorLink,
    };

    console.log('Updating note with:', updatedNote);

    fetch(`http://localhost:3000/notes/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedNote),
    })
      .then(response => response.json())
      .then(updatedNote => {
        setOriginalNoteText(updatedNote.text);
        setImageUrl(updatedNote.imageUrl);
        setImageAuthor(updatedNote.imageAuthor);
        setImageAuthorLink(updatedNote.imageAuthorLink);
      })
      .catch(error => console.error('Error updating note:', error));
  };


  const fetchImage = () => {
    if (noteText.trim()) {
      fetch(`http://localhost:3000/notes/unsplash/${noteText}`)
        .then(response => response.json())
        .then(data => {
          console.log('Fetched image data:', data); 
          if (data && data.urls && data.user) {
            const updatedImageUrl = data.urls.regular;
            const updatedImageAuthor = data.user.name;
            const updatedImageAuthorLink = data.user.links.html;
            handleUpdate(updatedImageUrl, updatedImageAuthor, updatedImageAuthorLink);
          }
        })
        .catch(error => console.error('Error fetching image:', error));
    } else {
      console.warn('Note text is empty. Cannot fetch image.');
    }
  };

  return (
    <div className="edit-note">
      <h1>Note: {originalNoteText} </h1>
      <h2>Note ID: {id}</h2>
      <input
        type="text"
        value={noteText || ""}
        onChange={(e) => setNoteText(e.target.value)}
      />
      <button onClick={fetchImage} disabled={!noteText.trim()}>
        Generate Image!
      </button>
      {imageUrl && (
        <div className="image-container">
          <img src={imageUrl} alt="Note related" />
          <p>
            Photo by{" "}
            <a href={imageAuthorLink} target="_blank" rel="noopener noreferrer">
              {imageAuthor}
            </a>
          </p>
        </div>
      )}
    </div>
  );
}

export default EditNote;
