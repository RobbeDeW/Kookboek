import React, { createContext, useContext, useState, FormEvent } from "react"; // FormEvent toegevoegd
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  useParams,
  useNavigate
} from "react-router-dom";

// Type definitions
interface Recept {
  id: string;
  naam: string;
  categorie: string;
  ingredienten: string[];
  bereidingswijze: string;
}

interface UserContextType {
  favorieten: Recept[];
  toggleFavoriet: (recept: Recept) => void;
  recepten: Recept[];
  addRecept: (newRecept: Omit<Recept, "id">) => void;
}

// Initializing UserContext with types
const UserContext = createContext<UserContextType | undefined>(undefined);

export default function App() {
  const [favorieten, setFavorieten] = useState<Recept[]>([]);
  const [recepten, setRecepten] = useState<Recept[]>([
    {
      id: "1",
      naam: "Spaghetti Bolognese",
      categorie: "diner",
      ingredienten: [
        "Spaghetti",
        "Rundergehakt",
        "Tomatensaus",
        "Ui",
        "Knoflook"
      ],
      bereidingswijze:
        "Kook de spaghetti. Bak het gehakt en voeg de tomatensaus toe. Serveer met de spaghetti."
    },
    {
      id: "2",
      naam: "Caesar Salad",
      categorie: "lunch",
      ingredienten: [
        "Sla",
        "Kipfilet",
        "Croutons",
        "Parmezaanse kaas",
        "Caesardressing"
      ],
      bereidingswijze: "Meng alle ingrediënten en voeg dressing naar smaak toe."
    },
    {
      id: "3",
      naam: "Pannenkoeken",
      categorie: "ontbijt",
      ingredienten: ["Bloem", "Melk", "Eieren", "Suiker", "Zout"],
      bereidingswijze: "Meng alle ingrediënten en bak in een pan."
    }
  ]);

  const toggleFavoriet = (recept: Recept) => {
    setFavorieten((prevFavorieten) => {
      if (prevFavorieten.find((fav) => fav.id === recept.id)) {
        return prevFavorieten.filter((fav) => fav.id !== recept.id);
      } else {
        return [...prevFavorieten, recept];
      }
    });
  };

  const addRecept = (newRecept: Omit<Recept, "id">) => {
    setRecepten([...recepten, { ...newRecept, id: Date.now().toString() }]);
  };

  return (
    <UserContext.Provider
      value={{ favorieten, toggleFavoriet, recepten, addRecept }}
    >
      <Router>
        <nav>
          <Link to="/">Home</Link> <Link to="/recepts">Recepts</Link>{" "}
          <Link to="/addrecept">Recept toevoegen</Link>{" "}
          <Link to="/receptenlijst">Categorie</Link>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/recepts" element={<Recepts />} />
          <Route path="/recepts/:id" element={<ReceptDetail />} />
          <Route path="/addrecept" element={<AddRecept />} />
          <Route path="/receptenlijst" element={<CategorieSelectie />} />
          <Route path="/receptenlijst/:categorie" element={<ReceptenLijst />} />
        </Routes>
      </Router>
    </UserContext.Provider>
  );
}

function Home() {
  const context = useContext(UserContext);
  if (!context) throw new Error("Home must be used within a UserContext");

  const { favorieten } = context;

  return (
    <div>
      <h1>Favoriete Recepten</h1>
      {favorieten.length === 0 ? (
        <p>Je hebt nog geen favoriete recepten.</p>
      ) : (
        <ul>
          {favorieten.map((recept) => (
            <li key={recept.id}>
              <Link to={`/recepts/${recept.id}`}>{recept.naam}</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Recepts() {
  const context = useContext(UserContext);
  if (!context) throw new Error("Recepts must be used within a UserContext");

  const { recepten } = context;

  return (
    <div>
      <h1>Alle Recepten</h1>
      <ul>
        {recepten.map((recept) => (
          <li key={recept.id}>
            <Link to={`/recepts/${recept.id}`}>{recept.naam}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ReceptDetail() {
  const { id } = useParams<{ id: string }>();
  const context = useContext(UserContext);
  if (!context)
    throw new Error("ReceptDetail must be used within a UserContext");

  const { recepten, favorieten, toggleFavoriet } = context;
  const recept = recepten.find((r) => r.id === id);

  if (!recept) return <p>Recept niet gevonden</p>;

  const isFavoriet = favorieten.some((fav) => fav.id === recept.id);

  return (
    <div>
      <h2>{recept.naam}</h2>
      <h3>Ingrediënten</h3>
      <ul>
        {recept.ingredienten.map((ingredient, index) => (
          <li key={index}>{ingredient}</li>
        ))}
      </ul>
      <h3>Bereidingswijze</h3>
      <p>{recept.bereidingswijze}</p>
      <button onClick={() => toggleFavoriet(recept)}>
        {isFavoriet ? "Verwijder uit favorieten" : "Voeg toe aan favorieten"}
      </button>
    </div>
  );
}

function AddRecept() {
  const [naam, setNaam] = useState("");
  const [ingredienten, setIngredienten] = useState("");
  const [bereidingswijze, setBereidingswijze] = useState("");
  const [categorie, setCategorie] = useState("ontbijt");
  const context = useContext(UserContext);
  if (!context) throw new Error("AddRecept must be used within a UserContext");

  const { addRecept } = context;
  const navigate = useNavigate();

  const handleSubmit = (e: FormEvent) => {
    // FormEvent correct gebruikt
    e.preventDefault();
    const nieuweIngredienten = ingredienten.split(",").map((ing) => ing.trim());
    addRecept({
      naam,
      ingredienten: nieuweIngredienten,
      bereidingswijze,
      categorie
    });
    navigate("/recepts");
  };

  return (
    <div>
      <h1>Voeg een Recept toe</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Naam:</label>
          <input
            type="text"
            value={naam}
            onChange={(e) => setNaam(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Ingrediënten (gescheiden door komma&#39;s):</label>
          <input
            type="text"
            value={ingredienten}
            onChange={(e) => setIngredienten(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Bereidingswijze:</label>
          <textarea
            value={bereidingswijze}
            onChange={(e) => setBereidingswijze(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Categorie:</label>
          <select
            value={categorie}
            onChange={(e) => setCategorie(e.target.value)}
          >
            <option value="ontbijt">Ontbijt</option>
            <option value="lunch">Lunch</option>
            <option value="diner">Diner</option>
          </select>
        </div>
        <button type="submit">Toevoegen</button>
      </form>
    </div>
  );
}

function CategorieSelectie() {
  return (
    <div>
      <h1>Selecteer een Categorie</h1>
      <ul>
        <li>
          <Link to="/receptenlijst/ontbijt">Ontbijt</Link>
        </li>
        <li>
          <Link to="/receptenlijst/lunch">Lunch</Link>
        </li>
        <li>
          <Link to="/receptenlijst/diner">Diner</Link>
        </li>
      </ul>
    </div>
  );
}

function ReceptenLijst() {
  const { categorie } = useParams<{ categorie: string }>();
  const context = useContext(UserContext);
  if (!context)
    throw new Error("ReceptenLijst must be used within a UserContext");

  const { recepten } = context;
  const gefilterdeRecepten = recepten.filter(
    (recept) => recept.categorie === categorie
  );

  return (
    <div>
      <h1>
        Recepten -{" "}
        {categorie
          ? categorie.charAt(0).toUpperCase() + categorie.slice(1)
          : ""}
      </h1>
      {gefilterdeRecepten.length === 0 ? (
        <p>Geen recepten gevonden voor deze categorie.</p>
      ) : (
        <ul>
          {gefilterdeRecepten.map((recept) => (
            <li key={recept.id}>
              <Link to={`/recepts/${recept.id}`}>{recept.naam}</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
