import { useEffect, useState } from "react";
import API from "../../services/api";
import "../../styles/AdminSafetyGuidelines.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function AdminSafetyGuidelines() {

  const [guidelines, setGuidelines] = useState([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "General",
  });

  const fetchGuidelines = async () => {

    try {

      const res = await API.get("/admin/guidelines");

      setGuidelines(res.data);

    } catch (error) {

      console.log(error);

    }

  };

  useEffect(() => {

    fetchGuidelines();

  }, []);

  const addGuideline = async () => {

    try {

      await API.post("/admin/guidelines", form);

      alert("Guideline Added Successfully");

      setForm({
        title: "",
        description: "",
        category: "General",
      });

      fetchGuidelines();

    } catch (error) {

      console.log(error);

      alert("Unable to Add Guideline");

    }

  };

const deleteGuideline = async (id) => {

  try {

    await API.delete(`/admin/guidelines/${id}`);

    alert("Guideline Deleted");

    fetchGuidelines();

  } catch (error) {

    console.log(error);

  }

};

const downloadPDF = () => {

  const doc = new jsPDF();

  doc.text(

    "Safety Guidelines Report",

    14,

    20

  );

  autoTable(doc,{

    head:[

      [

        "Title",

        "Description",

        "Category",

      ],

    ],

    body:

    guidelines.map((item)=>([

      item.title,

      item.description,

      item.category,

    ]))

  });

  doc.save(

    "Safety_Guidelines.pdf"

  );

};

  return (

    <div className="admin-guidelines">

      <h1>🛡 Safety Guidelines</h1>
      <button

className="download-btn"

onClick={downloadPDF}

>

📄 Download PDF

</button>

      <div className="guideline-form">

        <input
          type="text"
          placeholder="Guideline Title"
          value={form.title}
          onChange={(e)=>
            setForm({
              ...form,
              title:e.target.value
            })
          }
        />

        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e)=>
            setForm({
              ...form,
              description:e.target.value
            })
          }
        />

        <select
          value={form.category}
          onChange={(e)=>
            setForm({
              ...form,
              category:e.target.value
            })
          }
        >

          <option>General</option>

          <option>Helmet</option>

          <option>Electrical</option>

          <option>Fire</option>

          <option>Construction</option>

        </select>

        <button
          onClick={addGuideline}
        >
          ➕ Add Guideline
        </button>

      </div>

      <h2>

        All Safety Guidelines

      </h2>

      <table className="guideline-table">

        <thead>

          <tr>

            <th>Title</th>

            <th>Description</th>

            <th>Category</th>

            <th>Date</th>
            <th>Action</th>

          </tr>

        </thead>

        <tbody>

          {guidelines.map((item)=>(

            <tr key={item._id}>

              <td>{item.title}</td>

              <td>{item.description}</td>

              <td>{item.category}</td>

              <td>

                {new Date(item.createdAt).toLocaleDateString()}

              </td>
              <td>

                <button

                className="delete-btn"

                onClick={() => deleteGuideline(item._id)}

                >

                Delete

                </button>

                </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  );

}

export default AdminSafetyGuidelines;