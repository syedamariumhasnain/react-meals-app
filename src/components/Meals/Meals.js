import { Fragment } from "react";

import MealsSummay from "./MealsSummary";
import AvailableMeals from "./AvailableMeals";

const Meals = () => {
  return (
    <Fragment>
      <MealsSummay />
      <AvailableMeals />
    </Fragment>
  );
};

export default Meals;
