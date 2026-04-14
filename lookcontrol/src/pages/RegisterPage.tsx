import { Link } from 'react-router-dom';
import { Scissors, Building, Users } from 'lucide-react';

export default function RegisterPage() {
  return (
    <div className="register-container">
      <div className="register-wrapper register-role-selector">
        <div className="register-logo">
          <div className="register-logo-icon"><Scissors size={18} /></div>
          <span className="register-logo-text">LookControl</span>
        </div>
        <div className="register-card register-role-card">
          <h1 className="register-title">¿Eres dueño o empleado?</h1>
          <p className="register-subtitle">Elige el tipo de cuenta para continuar con el registro.</p>
          <div className="register-role-grid">
            <Link to="/register/owner" className="register-role-button">
              <Building size={24} />
              <span>Dueño</span>
            </Link>
            <Link to="/register/employee" className="register-role-button">
              <Users size={24} />
              <span>Empleado</span>
            </Link>
          </div>
        </div>
        <p className="register-footer">
          ¿Ya tienes cuenta? <Link to="/login" className="register-footer-link">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
}
