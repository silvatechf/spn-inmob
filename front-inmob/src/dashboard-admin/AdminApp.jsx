import React, { useEffect } from "react";
import { Link } from "react-router-dom";

export default function AdminApp() {
  // Carga aislada de Bootstrap 5
  useEffect(() => {
    import("bootstrap/dist/css/bootstrap.min.css");
    import("bootstrap-icons/font/bootstrap-icons.css");
  }, []);

  return (
    <div className="container-fluid min-vh-100 bg-light py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow-sm border-0 rounded-3">
            <div className="card-body p-5 text-center">
              <span className="badge bg-primary rounded-pill mb-3">
                Bootstrap 5 Active
              </span>
              <h2 className="card-title fw-bold text-dark mb-3">
                Panel de Control General
              </h2>
              <p className="card-text text-secondary mb-4">
                Auditoría interna, gestión del catálogo indexado y operaciones transaccionales del CRUD.
              </p>
              <Link to="/" className="btn btn-outline-dark btn-lg w-100 rounded-3">
                <i className="bi bi-arrow-left me-2"></i> Volver a Vista Pública
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}