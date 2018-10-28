import React from "react";
import { Link } from "react-router-dom";

export function ObjectCard({ object }) {
  const id = encodeURIComponent(object.id);
  return (
    <div className="col-md-6 col-sm-12 mb-4 col-lg-3">
      <div className="card">
        <Link className="object-card" to={`/objects/${id}`}>
          <img
            className="card-img-top"
            src={`https://media.graphcms.com/resize=width:500,height:500,fit:crop,align:center/compress/${
              object.picture.handle
            }`}
            alt={object.classification.name}
            title={object.description}
          />
        </Link>

        <div className="card-body">
          <h5 className="card-title">{object.classification.name}</h5>

          <p class="card-text">
            <small class="text-muted">
              Dateperiod: {object.yearfrom} - {object.yearto} <br />
              Origin: {object.origin ? object.origin.name : "Unknown"} <br />
              Producer: {object.producer ? object.producer.name : "Unknown"}
            </small>
          </p>
          <Link class="btn btn-primary" to={`/objects/${id}`}>
            Show similar objects
          </Link>
        </div>
      </div>
    </div>
  );
}
