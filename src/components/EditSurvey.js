import React, { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useParams } from "react-router-dom";
import axios from "../utils/axios";
import $ from "jquery";
import "jquery-ui/dist/jquery-ui";
import "jquery-ui/ui/widgets/draggable";
import "jquery-ui/ui/widgets/droppable";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentSurvey } from "../redux/surveySlice";
import { EDIT_SURVEY, FETCH_SURVEY } from "../utils/endpoints";
import { INTERNAL_SERVER_ERROR } from "../utils/messages";

const EditSurvey = () => {
  const { id } = useParams();
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const { register, control, handleSubmit, setValue } = useForm({
    defaultValues: {
      survey: {
        components_attributes: [],
      },
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "survey.components_attributes",
  });
  const dispatch = useDispatch();
  const survey = useSelector((state) => state.survey.currentSurvey);

  useEffect(() => {
    try {
      axios
        .get(FETCH_SURVEY.replace(":id", id))
        .then((response) => {
          if (response.data.code === 200) {
            dispatch(setCurrentSurvey(response.data));
            response.data.result?.components.forEach((component) =>
              append(component)
            );
          } else if (response.data.code === 422) {
            console.log("unbale to process");
          }
        })
        .catch((error) => {
          console.error("There was an error fetching the survey!", error);
        });
    } catch (error) {
      console.log(INTERNAL_SERVER_ERROR);
    }
  }, [id, append, dispatch]);

  const onSubmit = (data) => {
    try {
      axios
        .put(EDIT_SURVEY.replace(":id", id), data)
        .then((response) => {
          if (response.data.code === 200) {
            setErrorMsg("");
            dispatch(setCurrentSurvey(response.data));
            setSuccessMsg(response.data.message);
          } else if (response.data.code === 422) {
            setSuccessMsg("");
            setErrorMsg(response.data.message);
            console.log("unbale to process");
          }
        })
        .catch((error) => {
          console.error("There was an error updating the survey!", error);
        });
    } catch (error) {
      console.log(INTERNAL_SERVER_ERROR);
    }
  };

  const makeDraggable = () => {
    $(".draggable").draggable({
      containment: "#survey-container",
      stop: (event, ui) => {
        const index = $(event.target).data("index");
        setValue(`components[${index}].x`, ui.position.left);
        setValue(`components[${index}].y`, ui.position.top);
      },
    });
  };

  const makeDroppable = () => {
    $("#toolbox .draggable").draggable({
      helper: "clone",
      revert: "invalid",
    });

    $("#survey-container").droppable({
      accept: "#toolbox .draggable",
      drop: (event, ui) => {
        const kind = ui.helper.data("kind");
        const content = kind === "label" ? "Label" : "";
        append({
          kind: kind,
          content: content,
          x: ui.helper.offset().left - $("#survey-container").offset(),
          y: ui.helper.offset().top - $("#survey-container").offset(),
        });
      },
    });
  };

  useEffect(() => {
    makeDraggable();
    makeDroppable();
  }, [fields]);

  return (
    <>
      <div
        className={`alert alert-${
          (successMsg && "success") || (errorMsg && "danger")
        }`}
        role="alert"
      >
        {(successMsg && successMsg) || (errorMsg && errorMsg)}
      </div>
      <div className="container-fluid m-2">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="row">
            <div className="col-md-3">
              <div id="toolbox">
                <div
                  className="draggable btn btn-primary mb-2"
                  data-kind="label"
                >
                  Add Label
                </div>
                <div className="draggable btn btn-secondary" data-kind="input">
                  Add Input
                </div>
              </div>
            </div>
            <div className="col-md-9">
              <div
                id="survey-container"
                style={{
                  width: "100%",
                  height: "800px",
                  border: "1px solid #ccc",
                }}
              >
                {fields.map((item, index) => (
                  <div
                    key={item.id}
                    className="draggable"
                    style={{ left: item.x, top: item.y }}
                    data-index={index}
                  >
                    {item.kind === "label" ? (
                      <input
                        name={`components[${index}].content`}
                        defaultValue={item.content}
                        {...register(`components[${index}].content`)}
                        className="form-control"
                      />
                    ) : (
                      <input
                        type="text"
                        name={`components[${index}].content`}
                        defaultValue={item.content}
                        {...register(`components[${index}].content`)}
                        className="form-control"
                      />
                    )}
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="btn btn-danger mt-2"
                    >
                      Remove
                    </button>
                    <input
                      type="hidden"
                      name={`components[${index}].x`}
                      defaultValue={item.x}
                      {...register(`components[${index}].x`)}
                    />
                    <input
                      type="hidden"
                      name={`components[${index}].y`}
                      defaultValue={item.y}
                      {...register(`components[${index}].y`)}
                    />
                    <input
                      type="hidden"
                      name={`components[${index}].kind`}
                      defaultValue={item.kind}
                      {...register(`components[${index}].kind`)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="d-flex flex-row-reverse ">
            <button type="submit" className="btn btn-success mt-3">
              Save Survey
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditSurvey;
