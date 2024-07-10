import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "../utils/axios";
import { useDispatch } from "react-redux";
import { setCurrentSurvey } from "../redux/surveySlice";
import { useNavigate } from "react-router-dom";
import { INTERNAL_SERVER_ERROR } from "../utils/messages";
import { CREATE_SURVEY, EDIT_SURVEY } from "../utils/endpoints";

const CreateSurvey = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState("");

  const onSubmit = (data) => {
    try {
      axios
        .post(CREATE_SURVEY, data)
        .then((response) => {
          if (response.data.code === 200) {
            setErrorMsg("");
            dispatch(setCurrentSurvey(response.data.result));
            navigate(EDIT_SURVEY.replace(":id", response.data.result.id));
          } else if (response.data.code === 422) {
            setErrorMsg("Unable to create survey");
          }
        })
        .catch((error) => {
          console.error("There was an error creating the survey!", error);
        });
    } catch (error) {
      console.log(INTERNAL_SERVER_ERROR);
    }
  };

  return (
    <>
      {errorMsg && (
        <div class="alert alert-danger" role="alert">
          A simple danger alert—check it out!
        </div>
      )}
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card">
              <div className="card-header text-center">
                <h2>Create Survey</h2>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">
                      Name
                    </label>
                    <input
                      name="name"
                      placeholder="Survey Name"
                      className="form-control"
                      {...register("name", { required: true })}
                    />
                    {errors.name && (
                      <span className="link-danger">Name is required</span>
                    )}
                  </div>
                  <div className="mb-3">
                    <label htmlFor="description" className="form-label">
                      Description
                    </label>
                    <textarea
                      name="description"
                      id="description"
                      placeholder="Survey Description"
                      className="form-control"
                      {...register("description")}
                    />
                  </div>
                  <button type="submit" className="btn btn-primary w-100">
                    Create Survey
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateSurvey;
