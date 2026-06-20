import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import API from "../api/api";

const emptyForm = {
  questionText: "",
  options: ["", "", "", ""],
  correctAnswer: 0,
  explanation: "",
};

const questionSchema = z.object({
  questionText: z.string().min(5, "Question must be at least 5 characters"),
  option1: z.string().min(1, "Option 1 is required"),
  option2: z.string().min(1, "Option 2 is required"),
  option3: z.string().min(1, "Option 3 is required"),
  option4: z.string().min(1, "Option 4 is required"),
  explanation: z.string().optional(),
});

function Admin({ theme }) {
    const isDarkMode = theme === "dark";

    const {
        register,
        handleSubmit: handleCreateSubmit,
        reset,
        formState: { errors },
        } = useForm({
        resolver: zodResolver(questionSchema),
    });

    const {
        register: registerEdit,
        handleSubmit: handleEditSubmit,
        reset: resetEdit,
        formState: { errors: editErrors },
        } = useForm({
        resolver: zodResolver(questionSchema),
    });

    const handleCreateQuestion = async (data) => {
        try {
            await API.post("/admin/questions", {
            questionText: data.questionText,
            options: [data.option1, data.option2, data.option3, data.option4],
            correctAnswer: form.correctAnswer,
            explanation: data.explanation || "",
        });

        setMessage("Question created");
        reset();
        setForm(emptyForm);
        fetchQuestions();
    } catch (err) {
        setMessage(err.response?.data?.error || "Save failed");
    }
    };

    const handleUpdateQuestion = async (data) => {
    try {
        await API.put(`/admin/questions/${editingId}`, {
        questionText: data.questionText,
        options: [data.option1, data.option2, data.option3, data.option4],
        correctAnswer: form.correctAnswer,
        explanation: data.explanation || "",
        });

        setMessage("Question updated");
        resetEdit();
        setForm(emptyForm);
        setEditingId(null);
        fetchQuestions();
    } catch (err) {
        setMessage(err.response?.data?.error || "Save failed");
    }
    };

    const styles = {
    page: {
      padding: "24px",
      color: isDarkMode ? "#f9fafb" : "#111827",
    },

    pageTitle: {
      marginBottom: "20px",
      color: isDarkMode ? "#f9fafb" : "#111827",
    },

    message: {
      padding: "10px 14px",
      borderRadius: "8px",
      background: isDarkMode ? "#312e81" : "#f3e8ff",
      color: isDarkMode ? "#ffffff" : "#581c87",
      fontWeight: "600",
    },

    formCard: {
      padding: "20px",
      borderRadius: "12px",
      background: isDarkMode ? "#111827" : "#ffffff",
      color: isDarkMode ? "#f9fafb" : "#111827",
      border: isDarkMode
        ? "3px solid rgba(148, 163, 184, 0.22)"
        : "3px solid #ccc",
      marginBottom: "24px",
      display: "flex",
      flexDirection: "column",
      gap: "14px",
    },

    sectionTitle: {
      marginTop: 0,
      color: isDarkMode ? "#f9fafb" : "#111827",
    },

    questionInput: {
      width: "100%",
      padding: "12px",
      fontSize: "15px",
      borderRadius: "8px",
      border: isDarkMode ? "1px solid #334155" : "1px solid #ccc",
      boxSizing: "border-box",
      background: isDarkMode ? "#020617" : "#ffffff",
      color: isDarkMode ? "#f9fafb" : "#111827",
    },

    optionsRow: {
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: "10px",
    },

    optionInput: {
      padding: "10px",
      fontSize: "14px",
      borderRadius: "8px",
      border: isDarkMode ? "1px solid #334155" : "1px solid #ccc",
      boxSizing: "border-box",
      background: isDarkMode ? "#020617" : "#ffffff",
      color: isDarkMode ? "#f9fafb" : "#111827",
    },

    selectLabel: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      fontWeight: "600",
      color: isDarkMode ? "#f9fafb" : "#111827",
    },

    explanationRow: {
      display: "flex",
      gap: "12px",
      alignItems: "stretch",
    },

    explanationInput: {
      flex: 1,
      minHeight: "80px",
      padding: "12px",
      borderRadius: "8px",
      border: isDarkMode ? "1px solid #334155" : "1px solid #ccc",
      resize: "vertical",
      boxSizing: "border-box",
      background: isDarkMode ? "#020617" : "#ffffff",
      color: isDarkMode ? "#f9fafb" : "#111827",
    },

    bulkTextarea: {
      width: "100%",
      padding: "12px",
      borderRadius: "8px",
      border: isDarkMode ? "1px solid #334155" : "1px solid #ccc",
      boxSizing: "border-box",
      marginBottom: "12px",
      background: isDarkMode ? "#020617" : "#ffffff",
      color: isDarkMode ? "#f9fafb" : "#111827",
    },

    questionCard: {
      padding: "16px",
      marginBottom: "16px",
      borderRadius: "12px",
      background: isDarkMode ? "#111827" : "#ffffff",
      color: isDarkMode ? "#f9fafb" : "#111827",
      border: isDarkMode
        ? "3px solid rgba(148, 163, 184, 0.22)"
        : "3px solid #ccc",
    },

    buttonRow: {
      display: "flex",
      gap: "12px",
      flexWrap: "wrap",
      marginTop: "12px",
    },

    modalOverlay: {
      position: "fixed",
      inset: 0,
      background: "rgba(0, 0, 0, 0.45)",
      backdropFilter: "blur(6px)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
      padding: "20px",
    },

    modalCard: {
      width: "min(900px, 95vw)",
      padding: "24px",
      borderRadius: "16px",
      background: isDarkMode ? "#111827" : "#ffffff",
      color: isDarkMode ? "#f9fafb" : "#111827",
      border: isDarkMode
        ? "3px solid rgba(148, 163, 184, 0.22)"
        : "3px solid #ccc",
      boxShadow: "0 20px 60px rgba(0, 0, 0, 0.35)",
      display: "flex",
      flexDirection: "column",
      gap: "14px",
    },

    deleteModal: {
      width: "min(420px, 90vw)",
      padding: "28px",
      borderRadius: "18px",
      background: isDarkMode ? "#111827" : "#ffffff",
      color: isDarkMode ? "#f9fafb" : "#111827",
      border: isDarkMode
        ? "3px solid rgba(148, 163, 184, 0.22)"
        : "3px solid #ccc",
      boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
    },

    deleteTitle: {
      marginTop: 0,
      marginBottom: "12px",
      textAlign: "center",
      color: isDarkMode ? "#f9fafb" : "#111827",
    },

    deleteText: {
      color: isDarkMode ? "#cbd5e1" : "#555",
      textAlign: "center",
      marginBottom: "24px",
    },

    deleteButtonRow: {
      display: "flex",
      justifyContent: "center",
      gap: "16px",
      flexWrap: "wrap",
    },
  };

  const [user] = useState(() => {
    return JSON.parse(localStorage.getItem("user") || "null");
  });

  const [questions, setQuestions] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [bulkText, setBulkText] = useState("");
  const [message, setMessage] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  const isEditing = Boolean(editingId);

  const fetchQuestions = async () => {
    try {
      const res = await API.get("/admin/questions");
      setQuestions(res.data.data);
    } catch (err) {
      setMessage(err.response?.data?.error || "Failed to load questions");
    }
  };

  useEffect(() => {
    if (user && user.role === "admin") {
      fetchQuestions();
    }
  }, [user]);

  if (!user || user.role !== "admin") {
    return <h2>Access denied. Admins only.</h2>;
  }

  const updateOption = (index, value) => {
    const newOptions = [...form.options];
    newOptions[index] = value;
    setForm({ ...form, options: newOptions });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await API.put(`/admin/questions/${editingId}`, form);
        setMessage("Question updated");
      } else {
        await API.post("/admin/questions", form);
        setMessage("Question created");
      }

      setForm(emptyForm);
      setEditingId(null);
      fetchQuestions();
    } catch (err) {
      setMessage(err.response?.data?.error || "Save failed");
    }
  };

    const handleEdit = (question) => {
        setEditingId(question._id);

        const editData = {
            questionText: question.questionText,
            option1: question.options[0] || "",
            option2: question.options[1] || "",
            option3: question.options[2] || "",
            option4: question.options[3] || "",
            explanation: question.explanation || "",
        };

        resetEdit(editData);

        setForm({
            questionText: question.questionText,
            options: question.options,
            correctAnswer: question.correctAnswer,
            explanation: question.explanation || "",
        });
    };

  const handleDelete = async () => {
    try {
      await API.delete(`/admin/questions/${deleteId}`);
      setMessage("Question deleted");

      setDeleteId(null);
      fetchQuestions();
    } catch (err) {
      setMessage(err.response?.data?.error || "Delete failed");
    }
  };

  const handleToggle = async (id) => {
    try {
      await API.put(`/admin/questions/${id}/toggle`);
      setMessage("Question status updated");
      fetchQuestions();
    } catch (err) {
      setMessage(err.response?.data?.error || "Toggle failed");
    }
  };

  const handleBulkImport = async () => {
    try {
      const parsed = JSON.parse(bulkText);

      await API.post("/admin/questions/import", {
        questions: parsed,
      });

      setMessage("Bulk import successful");
      setBulkText("");
      fetchQuestions();
    } catch (err) {
      setMessage(err.response?.data?.error || "Invalid JSON or import failed");
    }
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.pageTitle}>Admin Panel</h1>

      {message && <p style={styles.message}>{message}</p>}

        <form
            onSubmit={handleCreateSubmit(handleCreateQuestion)}
            style={styles.formCard}
            className="admin-card"
        >
        <h2 style={styles.sectionTitle}>Create Question</h2>

        <input
        style={styles.questionInput}
        placeholder="Question text"
        {...register("questionText")}
        />
        {errors.questionText && (
        <p style={{ color: "#dc2626", fontWeight: "700" }}>
            {errors.questionText.message}
        </p>
        )}

        <div style={styles.optionsRow}>
        {[1, 2, 3, 4].map((num) => (
            <div key={num}>
            <input
                style={styles.optionInput}
                placeholder={`Option ${num}`}
                {...register(`option${num}`)}
            />

            {errors[`option${num}`] && (
                <p style={{ color: "#dc2626", fontWeight: "700" }}>
                {errors[`option${num}`].message}
                </p>
            )}
            </div>
        ))}
        </div>

        <div style={styles.selectLabel}>
          <span>Correct answer:</span>

          <div className="select">
            <div
              className="selected"
              data-default="Option 1"
              data-one="Option 2"
              data-two="Option 3"
              data-three="Option 4"
            ></div>

            <div className="options">
              {[0, 1, 2, 3].map((value) => (
                <div key={value}>
                  <input
                    id={`option-${editingId || "create"}-${value}`}
                    name={`correct-answer-${editingId || "create"}`}
                    type="radio"
                    checked={form.correctAnswer === value}
                    onChange={() => setForm({ ...form, correctAnswer: value })}
                  />

                  <label
                    className="option"
                    htmlFor={`option-${editingId || "create"}-${value}`}
                    data-txt={`Option ${value + 1}`}
                  ></label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={styles.explanationRow}>
            <textarea
                style={styles.explanationInput}
                placeholder="Explanation"
                {...register("explanation")}
            />

          <button type="submit" className="purple-button">
            Create Question
          </button>
        </div>
      </form>

      <hr />

      <h2 style={styles.sectionTitle}>Bulk Import</h2>
      <textarea
        style={styles.bulkTextarea}
        rows="8"
        placeholder='[
  {
    "questionText": "What is 2 + 2?",
    "options": ["1", "2", "3", "4"],
    "correctAnswer": 3,
    "explanation": "2 + 2 equals 4."
  }
]'
        value={bulkText}
        onChange={(e) => setBulkText(e.target.value)}
      />

      <br />

      <button
        className="purple-button"
        onClick={handleBulkImport}
        style={{ marginBottom: "32px" }}
      >
        Import Questions
      </button>

      <hr />

      <h2 style={{ ...styles.sectionTitle, marginTop: "32px" }}>Questions</h2>

      {questions.map((q) => (
        <div key={q._id} style={styles.questionCard} className="admin-question-card">
          <h3>{q.questionText}</h3>

          <ol>
            {q.options.map((opt, index) => (
              <li key={index}>
                {opt} {index === q.correctAnswer ? "✓" : ""}
              </li>
            ))}
          </ol>

          <p>
            <strong>Explanation:</strong> {q.explanation || "None"}
          </p>

          <p>
            <strong>Status:</strong> {q.isActive ? "Active" : "Inactive"}
          </p>

          <div style={styles.buttonRow}>
            <button className="purple-button" onClick={() => handleEdit(q)}>
              Edit
            </button>

            <button className="red-button" onClick={() => setDeleteId(q._id)}>
              Delete
            </button>

            <button className="orange-button" onClick={() => handleToggle(q._id)}>
              {q.isActive ? "Deactivate" : "Activate"}
            </button>
          </div>
        </div>
      ))}

      {isEditing && (
        <div style={styles.modalOverlay}>
            <form
                onSubmit={handleEditSubmit(handleUpdateQuestion)}
                style={styles.modalCard}
                className="admin-modal"
            >
            <h2 style={styles.sectionTitle}>Edit Question</h2>

            <input
                style={styles.questionInput}
                placeholder="Question text"
                {...registerEdit("questionText")}
                />
                {editErrors.questionText && (
                <p style={{ color: "#dc2626", fontWeight: "700" }}>
                    {editErrors.questionText.message}
                </p>
            )}

            <div style={styles.optionsRow}>
                {[1, 2, 3, 4].map((num) => (
                    <div key={num}>
                    <input
                        style={styles.optionInput}
                        placeholder={`Option ${num}`}
                        {...registerEdit(`option${num}`)}
                    />

                    {editErrors[`option${num}`] && (
                        <p style={{ color: "#dc2626", fontWeight: "700" }}>
                        {editErrors[`option${num}`].message}
                        </p>
                    )}
                    </div>
                ))}
            </div>

            <div style={styles.selectLabel}>
              <span>Correct answer:</span>

              <div className="select">
                <div
                  className="selected"
                  data-default="Option 1"
                  data-one="Option 2"
                  data-two="Option 3"
                  data-three="Option 4"
                ></div>

                <div className="options">
                  {[0, 1, 2, 3].map((value) => (
                    <div key={value}>
                      <input
                        id={`edit-option-${value}`}
                        name="edit-correct-answer"
                        type="radio"
                        checked={form.correctAnswer === value}
                        onChange={() => setForm({ ...form, correctAnswer: value })}
                      />

                      <label
                        className="option"
                        htmlFor={`edit-option-${value}`}
                        data-txt={`Option ${value + 1}`}
                      ></label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={styles.explanationRow}>
                <textarea
                    style={styles.explanationInput}
                    placeholder="Explanation"
                    value={form.explanation}
                    onChange={(e) => setForm({ ...form, explanation: e.target.value })}
                />  

              <button type="submit" className="purple-button">
                Update Question
              </button>
            </div>

            <button
              type="button"
              className="red-button"
              onClick={() => {
                setEditingId(null);
                setForm(emptyForm);
              }}
            >
              Cancel Edit
            </button>
          </form>
        </div>
      )}

      {deleteId && (
        <div style={styles.modalOverlay}>
          <div style={styles.deleteModal} className="admin-delete-modal">
            <h2 style={styles.deleteTitle}>Delete Question?</h2>

            <p style={styles.deleteText}>This action cannot be undone.</p>

            <div style={styles.deleteButtonRow}>
              <button className="red-button" onClick={handleDelete}>
                Confirm Delete
              </button>

              <button className="purple-button" onClick={() => setDeleteId(null)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Admin;