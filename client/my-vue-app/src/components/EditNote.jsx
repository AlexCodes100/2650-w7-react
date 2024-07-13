import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./EditNote.css";
import { useQuery, useLazyQuery, useMutation, gql } from "@apollo/client";

const GET_NOTE = gql`
  query GetNote($id: String!) {
    note(id: $id) {
      id
      text
      imageUrl
      imageAuthor
      imageAuthorLink
    }
  }
`;

const UPDATE_NOTE = gql`
  mutation UpdateNote($id: String!, $text: String!, $imageUrl: String, $imageAuthor: String, $imageAuthorLink: String) {
    updateNote(id: $id, text: $text, imageUrl: $imageUrl, imageAuthor: $imageAuthor, imageAuthorLink: $imageAuthorLink) {
      id
      text
      imageUrl
      imageAuthor
      imageAuthorLink
    }
  }
`;

const FETCH_IMAGE = gql`
  query FetchImage($query: String!) {
    fetchImage(query: $query) {
      urls {
        regular
      }
      user {
        name
        links {
          html
        }
      }
    }
  }
`;

function EditNote() {
  const { id } = useParams();
  const [noteText, setNoteText] = useState("");
  // const [originalNoteText, setOriginalNoteText] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageAuthor, setImageAuthor] = useState("");
  const [imageAuthorLink, setImageAuthorLink] = useState("");

  const { loading, error, data } = useQuery(GET_NOTE, { variables: { id } });
  const [updateNote] = useMutation(UPDATE_NOTE);
  const [fetchImage, { data: imageData }] = useLazyQuery(FETCH_IMAGE);

  useEffect(() => {
    if (data && data.note) {
      setNoteText(data.note.text);
      setImageUrl(data.note.imageUrl);
      setImageAuthor(data.note.imageAuthor);
      setImageAuthorLink(data.note.imageAuthorLink);
    }
  }, [data]);

  useEffect(() => {
    if (imageData && imageData.fetchImage) {
      const fetchedImage = imageData.fetchImage;
      const updatedImageUrl = fetchedImage.urls.regular;
      const updatedImageAuthor = fetchedImage.user.name;
      const updatedImageAuthorLink = fetchedImage.user.links.html;
      setImageUrl(updatedImageUrl);
      setImageAuthor(updatedImageAuthor);
      setImageAuthorLink(updatedImageAuthorLink);
      handleUpdate(updatedImageUrl, updatedImageAuthor, updatedImageAuthorLink);
    }
  }, [imageData]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  const handleUpdate = (updatedImageUrl, updatedImageAuthor, updatedImageAuthorLink) => {
    updateNote({
      variables: {
        id,
        text: noteText,
        imageUrl: updatedImageUrl || imageUrl,
        imageAuthor: updatedImageAuthor || imageAuthor,
        imageAuthorLink: updatedImageAuthorLink || imageAuthorLink
      },
      onCompleted: () => {
        console.log("Note updated");
      }
    });
  };

  const fetchImageHandler = () => {
    if (noteText.trim()) {
      fetchImage({ variables: { query: noteText } });
    } else {
      console.warn("Note text is empty. Cannot fetch image.");
    }
  };

  return (
    <div className="edit-note">
      <h1>Note: {noteText} </h1>
      <h2>Note ID: {id}</h2>
      <input
        type="text"
        value={noteText || ""}
        onChange={(e) => setNoteText(e.target.value)}
      />
      <button onClick={fetchImageHandler} disabled={!noteText.trim()}>
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
