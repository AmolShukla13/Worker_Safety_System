import { useState } from "react";
import API from "../services/api";
import "../styles/ChangePassword.css";

function ChangePassword() {

  const [form, setForm] = useState({

    currentPassword: "",

    newPassword: "",

    confirmPassword: "",

  });

  const handleChangePassword = async () => {

    if (

      form.newPassword !== form.confirmPassword

    ) {

      alert("Passwords do not match");

      return;

    }

    try {

      const res = await API.put(

        "/auth/change-password",

        {

          currentPassword:

            form.currentPassword,

          newPassword:

            form.newPassword,

        }

      );

      alert(res.data.message);

      setForm({

        currentPassword: "",

        newPassword: "",

        confirmPassword: "",

      });

    } catch (err) {

      alert(

        err.response?.data?.message ||

          "Password Update Failed"

      );

    }

  };

  return (

    <div className="change-password-page">

      <div className="change-card">

        <h1>

          🔑 Change Password

        </h1>

        <input

          type="password"

          placeholder="Current Password"

          value={form.currentPassword}

          onChange={(e)=>

            setForm({

              ...form,

              currentPassword:

                e.target.value,

            })

          }

        />

        <input

          type="password"

          placeholder="New Password"

          value={form.newPassword}

          onChange={(e)=>

            setForm({

              ...form,

              newPassword:

                e.target.value,

            })

          }

        />

        <input

          type="password"

          placeholder="Confirm Password"

          value={form.confirmPassword}

          onChange={(e)=>

            setForm({

              ...form,

              confirmPassword:

                e.target.value,

            })

          }

        />

        <button

          onClick={handleChangePassword}

        >

          Update Password

        </button>

      </div>

    </div>

  );

}

export default ChangePassword;