import { useEffect, useState } from "react";
import "./App.scss";
import { Button, Hidden } from "@mui/material";

import useLocalStorage from "../src/hooks/localStorage.js";

let initialData = {
  type: "dashboard",

  category: [
    {
      name: "CSPM",
      value: ["DATA 1", "DATA 2", "DATA 3", "SSUP 4"],
    },
    {
      name: "CWPP",
      value: ["HEY 1", "HEY 2"],
    },
    {
      name: "Registry",
      value: ["SOME", "parso 2", "SOME 3", "parso 4"],
    },
  ],
};

function App() {
  
  const [addingWidget, setAddingWidget] = useState(false);

  const [data, setData, removeData] = useLocalStorage(
    "dashboardData",
    initialData
  );
  const [selectedCategory, setSelectedCategory] = useState(
    data.category[0].name
  );
  const [newItem, setNewItem] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const removeItem = (categoryName, itemIndex) => {
    const updatedCategories = data.category.map((cat) => {
      if (cat.name === categoryName) {
        return {
          ...cat,
          value: cat.value.filter((_, index) => index !== itemIndex),
        };
      }
      return cat;
    });
    setData({ ...data, category: updatedCategories });
  };

  const addItem = () => {
    const updatedCategories = data.category.map((cat) => {
      if (cat.name === selectedCategory) {
        return { ...cat, value: [...cat.value, newItem] };
      }
      return cat;
    });
    setData({ ...data, category: updatedCategories });
    setNewItem("");
  };

  const handleSearch = () => {
    const results = [];
    data.category.forEach((cat) => {
      cat.value.forEach((item) => {
        if (item.toLowerCase().includes(searchTerm.toLowerCase())) {
          results.push({ category: cat.name, item });
        }
      });
    });
    setSearchResults(results);
    console.log("results => " + results);
  };

  return (
    <>
      <div
        className="wrapper"
        style={
          addingWidget ? { opacity: 0.1, maxHeight: "100px" } : { opacity: 1 }
        }
      >
        <h3>CNAPP Dashboard</h3>

        <div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Widget"
          />
          <button onClick={handleSearch}>Search</button>
        </div>

        <div className="categories">
          {data.category.map((item, indx) => (
            <div className="category" key={indx}>
              <h4> {item.name} </h4>
              <div className="widget-wrapper">
                {searchTerm == '' && item.value.map((item) => (
                  <div className="widget" key={indx}>
                    {item}
                  </div>
                ))}

                {searchTerm != '' && searchResults.length > 0 && 
                searchResults.map((result, index) => (
                <div key={index} className="widget">
                  {result.item} 
                </div>
              ))}

                <div className="widget">
                  <Button onClick={() => setAddingWidget(!addingWidget)}>
                    {" "}
                    + Add / ✎ EDit
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {addingWidget && (
        <div className="adding-modal">
          <div className="heading">Add Widget</div>
          <div className="category-tags">
            {data.category.map((item, indx) => (
              <div
                className="tags"
                key={indx}
                onClick={() => setSelectedCategory(item.name)}
              >
                {item.name}
              </div>
            ))}
          </div>
          <div className="select-section">
            <div className="widgets">
              {data.category
                .find((cat) => cat.name === selectedCategory)
                .value.map((item, indx) => (
                  <div className="widget" key={indx}>
                    <p>{item}</p>
                    <div onClick={() => removeItem(selectedCategory, indx)}>
                      <svg
                        className="svg-wrapper"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="20"
                        height="20"
                        color="rgb(241, 31, 31)"
                        fill="none"
                      >
                        <path
                          d="M19.0005 4.99988L5.00049 18.9999M5.00049 4.99988L19.0005 18.9999"
                          stroke="currentColor"
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                ))}
            </div>
            <div className="add-feature">
              <input
                type="text"
                value={newItem}
                placeholder="Enter Widget Name"
                onChange={(e) => setNewItem(e.target.value)}
              />
              <div className="addBtn" onClick={addItem}>
                {" "}
                Add{" "}
              </div>
            </div>
            <div
              className="buttons"
              onClick={() => setAddingWidget(!addingWidget)}
            >
              Cancel
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
