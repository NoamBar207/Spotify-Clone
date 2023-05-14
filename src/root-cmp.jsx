import React from "react";

// const { Switch, Route } = ReactRouterDOM
import { Routes, Route } from "react-router";

import routes from "./routes";

import { AppFooter } from "./cmps/AppFooter";
import { MainMenu } from "./cmps/MainMenu";
import { AppHeader } from "./cmps/AppHeader";

export function RootCmp() {
  return (
    <div className="root-cmp">
      <AppHeader />
      <MainMenu />
      <Routes>
        {routes.map((route) => (
          <Route
            key={route.path}
            exact={true}
            element={route.component}
            path={route.path}
          />
        ))}
      </Routes>
      <AppFooter />
    </div>
  );
}
