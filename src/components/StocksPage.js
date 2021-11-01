import React, { useEffect, useState } from "react";
import "../App.css";
import { Table, Form } from "react-bootstrap";
import { csv } from "d3";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSortUp,
  faSortDown,
  faArrowsAltV,
} from "@fortawesome/free-solid-svg-icons";


function StocksPage() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTitle, setSearchTitle] = useState("");
  const [data, setData] = useState([]);
  const [symbolName, setSymbolName] = useState(null);
  const [order, setOrder] = useState("ASC");
  const [icon, setIcon] = useState(faArrowsAltV);

  useEffect(() => {
    csv("https://prototype.sbulltech.com/api/v2/instruments").then((data) => {
      setList(data);
      console.log(data);
    });
  }, []);

  function clickMe(item) {
    console.log(item);
    const Symbol_data = item.Symbol;
    console.log(Symbol_data);
    setSymbolName(Symbol_data);

    fetch(`https://prototype.sbulltech.com/api/v2/quotes/${Symbol_data}`).then(
      (response) => {
        response.json().then((result) => {
          console.log("result==>", result);
          console.log(result.payload[Symbol_data]);
          setData(result.payload[Symbol_data]);
        });
      }
    );
  }

  function sorting(col) {
    if (order === "ASC") {
      const sorted = [...data].sort((a, b) =>
        a[col].toLowerCase() > b[col].toLowerCase() ? 1 : -1
      );
      setData(sorted);
      setOrder("DSC");
      setIcon(faSortUp);
    }
    if (order === "DSC") {
      const sorted = [...data].sort((a, b) =>
        a[col].toLowerCase() < b[col].toLowerCase() ? 1 : -1
      );
      setData(sorted);
      setOrder("ASC");
      setIcon(faSortDown);
    }
  }
  return (
    <>
      <div className="stock_page">
        <h3>STOCK-PAGE</h3>
        <div className="search_box">
          <Form.Control
            type="text"
            placeholder="Search Stock..."
            onChange={(event) => setSearchTitle(event.target.value)}
          />
        </div>
        <div className="stock_table">
          <Table striped bordered hover variant="dark" >
            <thead>
              <tr>
                <th>Symbol</th>
                <th>Name</th>
                <th>Sector</th>
                <th>Validtill</th>
              </tr>
            </thead>
            <tbody>
              {list
                .filter((value) => {
                  if (searchTitle === "") {
                    return value;
                  } else if (
                    value.Name.toLowerCase().includes(searchTitle.toLowerCase())
                  ) {
                    return value;
                  }
                })
                .map((item, i) => (
                  <tr>
                    <td>
                      <a onClick={() => clickMe(item)} href="#quote">
                        {item.Symbol}
                      </a>
                    </td>
                    <td>{item.Name}</td>
                    <td>{item.Sector}</td>
                    <td>{item.Validtill}</td>
                  </tr>
                ))}
            </tbody>
          </Table>
        </div>
      </div>

      <div id="quote" className="quote_page">
        <h3>QUOTE PAGE</h3>
        <h2>{symbolName}</h2>
        <Table striped bordered hover variant="dark">
          <thead>
            <tr>
              <th>Price</th>
              <th onClick={() => sorting("time")}>
                Time <FontAwesomeIcon icon={icon} color="red" />
              </th>
              <th>Validtill</th>
            </tr>
          </thead>
          <tbody>
            {data.map((val, key) => (
              <tr>
                <td>{val.price}</td>
                <td>{val.time}</td>
                <td>{val.valid_till}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </>
  );
}

export default StocksPage;
