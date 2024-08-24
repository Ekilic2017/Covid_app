import { render, screen } from "@testing-library/react";
import Detail from "../pages/Detail/index";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { thunk } from "redux-thunk";
import { BrowserRouter } from "react-router-dom";
import { exa_data } from "../constants";

// sahte store kurulumu
const mockStore = configureStore([thunk]);

it("yüklenme durumunda loader bileşenleri ekrana basılır", () => {
  const store = mockStore({ isLoading: true, error: null, data: null });

  render(
    <BrowserRouter>
      <Provider store={store}>
        <Detail />
      </Provider>
    </BrowserRouter>
  );

  // loader'lar ekrana geliyor mu
  screen.getByTestId("header-loader");
  screen.getAllByTestId("card-loader");
});

it("hata gelme durumunda error bileşeni ekrana basılır", () => {
  const store = mockStore({
    isLoading: false,
    error: "404 content not found",
    data: null,
  });

  render(
    <Provider store={store}>
      <BrowserRouter>
        <Detail />
      </BrowserRouter>
    </Provider>
  );

  screen.getByText(/404 content/i);
});

it("veri gelme durumunda ülke bilgisi ve kartlar ekrana basılır", () => {
  const store = mockStore({
    isLoading: false,
    error: null,
    data: exa_data,
  });

  render(
    <Provider store={store}>
      <BrowserRouter>
        <Detail />
      </BrowserRouter>
    </Provider>
  );

  // ülke ismi ekrana geliyor mu?
  screen.getByText("Turkiye");

  // ekrandaki resmi al
  const img = screen.getByRole("img");

  // resmin kaynağı doğru mu?
  expect(img).toHaveProperty("src", exa_data.country.flags.png);


  // covid nesnesini diziye çevirir
  const arr = Object.entries(exa_data.covid);

  // dizideki bütün elemaların key ve value değerleri ekrana geliyor mu?
  arr.forEach((item) => {
    screen.getByText(item[0].split("_").join(" "));
    screen.getByText(item[1]);
  });
});