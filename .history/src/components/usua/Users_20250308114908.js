{`
        .container {
          padding: 20px;
          margin-top: 80px; 
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }

        .header {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background-color: #007bff;
          color: white;
          padding: 18px;
          box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
          z-index: 1000;
        }

        .header-left {
          flex-grow: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 680px;
        }

        .icon {
          font-size: 44px;
          cursor: pointer;
          transition: transform 0.2s;
        }

        .icon:hover {
          transform: scale(1.1);
        }

        .logo {
          height: 50px;
        }

        /* Contenedor principal para el layout */
        .content-container {
          display: flex;
          justify-content: space-between;
          margin-top: 20px;
          flex: 1;
        }

        /* Formulario */
        .form-container {
          width: 40%;
          padding: 25px;
          background: #f9f9f9;
          border-radius: 8px;
          box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
        }

        form {
          display: flex;
          flex-direction: column;
        }

        label {
          font-weight: bold;
        }

        input, select, textarea {
          padding: 8px;
          margin: 5px 0;
          border: 1px solid #ccc;
          border-radius: 4px;
        }

        button {
          background-color: #28a745;
          color: white;
          padding: 10px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        button:hover {
          background-color: #218838;
        }

        /* Tabla de usuarios */
        .table-container {
          width: 58%;
          padding: 20px;
          background: white;
          border-radius: 8px;
          box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        th, td {
          border: 1px solid #ddd;
          padding: 10px;
          text-align: center;
        }

        th {
          background-color: rgb(184, 176, 177);
          font-weight: bold;
        }

        tr:nth-child(even) {
          background-color:rgb(140, 192, 190);
        }

        tr:hover {
          background-color: rgb(243, 250, 177);
          transition: 0.3s;
        }

      `}</style>
    </>
  );
};

export default Users;
