import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<h1>AgendaFácil — Home</h1>} />
        <Route path="/login" element={<h1>Login</h1>} />
        <Route path="/busca" element={<h1>Buscar Profissionais</h1>} />
        <Route path="/agendamentos" element={<h1>Meus Agendamentos</h1>} />
        <Route path="/painel" element={<h1>Painel do Profissional</h1>} />
        <Route path="/admin" element={<h1>Admin</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
