import { useEffect, useState, useRef } from 'react';
import './App.css';

function App() {
  const [input, setInput] = useState("");
  const [content, setContent] = useState("");
  const [notes, setNotes] = useState([]);
  const isFirstRender = useRef(true); // only new line added

  // LOAD saved notes when app starts
  useEffect(() => {
    const savedNotes = localStorage.getItem("notes");
    if (savedNotes) {
      try {
        const parsedNotes = JSON.parse(savedNotes);
        if (Array.isArray(parsedNotes)) {
          setNotes(parsedNotes);
        }
      } catch (err) {
        console.error("Error parsing notes from storage:", err);
      }
    }
  }, []);

  // SAVE notes when notes change, skip first render
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return; // skip saving empty array on first render
    }
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  //Add Notes function
  const addNotes = () => {
    if (input.trim() === "" || content.trim() === "") {
      alert("enter title and note first!");
      return;
    };

    const newNote = {
      id: Date.now(),
      title: input,
      content: content,
      color: "#ffffff",
      date: new Date().toLocaleString()
    };

    setNotes([...notes, newNote]); // exactly like your Todo app
    setInput("");
    setContent("");
  };

   //Delete Notes function
  const deleteNotes = (idToDelete) => {
    setNotes(notes.filter((note) => note.id !== idToDelete));
  };
   //Edit Notes function
  const editNotes = (idToEdit) => {
    const noteToEdit = notes.find(note => note.id === idToEdit);
    if (!noteToEdit) return;

    const newTitle = prompt("Edit title", noteToEdit.title);
    const newContent = prompt("Edit content", noteToEdit.content);
    if (newTitle === null || newContent === null) return;

    const editedNotes = notes.map((note) =>
      note.id === idToEdit ? { ...note, title: newTitle, content: newContent } : note
    );
    setNotes(editedNotes);
  };

  return (
    <>
      <div className="min-h-screen flex justify-center items-start bg-orange-200 py-10">
        <div className="p-6 max-w-md w-full bg-orange-400 rounded-xl shadow-lg">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            type='text'
            placeholder='Enter title...'
            className='border p-2 w-full mb-2'
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className='border p-2 w-full mb-2'
            placeholder='Enter note...'
          />
          <button onClick={addNotes} className='bg-blue-500 text-white px-4 py-2 rounded'>Add</button>
          <ul className="mt-4 flex flex-col gap-4">
            {notes.map((note) => (
              <li key={note.id} className="bg-white w-full p-4 rounded-lg shadow-sm">
                <h3 className="font-bold text-lg mb-1">{note.title}</h3>
                <p className="mb-1">{note.content}</p>
                <small className="text-gray-500">{note.date}</small>

                <div className="flex justify-end gap-2 mt-3">
                  <button
                    onClick={() => deleteNotes(note.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                  >
                    Delete
                  </button>

                  <button
                    onClick={() => editNotes(note.id)}
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                  >
                    Edit
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>


    </>
  );
}

export default App;
