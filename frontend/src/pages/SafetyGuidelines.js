import { useEffect, useState } from "react";
import API from "../services/api";
import "../styles/SafetyGuidelines.css";

function SafetyGuidelines() {

  const [guidelines, setGuidelines] = useState([]);

  useEffect(() => {

    fetchGuidelines();

  }, []);

  const fetchGuidelines = async () => {

    try {

      const res = await API.get("/guidelines");

      setGuidelines(res.data);

    } catch (error) {

      console.log(error);

    }

  };

  return (

    <div className="guidelines-page">

      <h1>🛡 Safety Guidelines</h1>

      {

        guidelines.map((item)=>(

          <div

          className="guideline-card"

          key={item._id}

          >

            <h3>

              {item.title}

            </h3>

            <p>

              {item.description}

            </p>

            <span>

              {item.category}

            </span>

          </div>

        ))

      }

    </div>

  );

}

export default SafetyGuidelines;