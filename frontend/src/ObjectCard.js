import React from "react";
import { Link } from "react-router-dom";

export function ObjectCard({ object }) {
  const id = encodeURIComponent(object.id);
  return (
    <Link className="object-card" to={`/objects/${id}`}>
      <h2>{object.classification.name}</h2>
      <img
        src={`https://media.graphcms.com/resize=width:500,height:500,fit:crop,align:center/compress/${
          object.picture.handle
        }`}
        alt={object.description}
      />
    </Link>
  );
}
