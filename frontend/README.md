# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

//contexts/index.js
It acts as a central export hub (aka barrel file) for all context providers or hooks.

Instead of importing each context individually from its file, you can re-export them all from index.js.

Without index.js
import { ToDoProvider } from './contexts/ToDoContext';
import { AuthProvider } from './contexts/AuthContext';

with index.js
export * from './ToDoContext';
export * from './AuthContext';

Then in components, you can just do:

import { ToDoProvider,AuthProvider } from './contexts';

using callback to use immutable state update pattern

setToDos(todo) - all the new todo's will be added and old one's will be deleted , hence , we will use callback instead 
setToDos((prev)=>[todo, ...prev]) //spread operator to access old values

todo only if single value was being accessed , but we are importing three properties , so use object
setToDos((prev)=>[{id : Date.now(), ...todo}, ...prev])

setToDos((prev)=> prev.map((prevToDo)=>(prevToDo.id === id ? todo : prevToDo)))
prevToDo is used to map across the array and compare to the actual id's if they already exist or not
todos - array
prev - state of previous array

Logic we used :
addToDo(todo)->	Adds a new todo at top-> [newTodo, ...prev]
updateToDo(id, updated)-> Replaces existing todo by id -> map: if match → replace
deleteToDo(id) -> Removes todo with matching id -> filter: if id !== match → keep
toggleComplete(id) -> Toggles completed field -> map: if match → flip value

## Local Storge

```text
    setItem() : JSON.Stringify();
    getItem() : JSON.Parse();
    const [items, setItems] = useState([]);
    //setItem()
    useEffect(() => {
    localStorage.setItem('items', JSON.stringify(items));
    }, [items]);

    //getItem()
    const [items, setItems] = useState([]);

    useEffect(() => {
    const items = JSON.parse(localStorage.getItem('items'));
    if (items) {
     setItems(items);
    }
    }, []);




```text    