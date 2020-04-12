import React, { useMemo, useState, useCallback } from "react";
import { Settings } from "./Settings";
import { Plan } from "./Plan";
import { Units, Mode, Plan as IPlan, Workout, ExternalPlan } from "../lib/model";
import { addDays, DEFAULT_DISPLAYMODE, getGuid } from "../lib/utils";
import { PLANS } from "../workouts/workouts";

const initialPlans: { [key: string]: IPlan } = {};
(PLANS as ExternalPlan[]).forEach((p) => {
  const id = getGuid();
  initialPlans[id] = {
    ...p,
    id,
    workouts: p.workouts.map((w) => {
      return {
        ...w,
        id: getGuid(),
      };
    }),
  };
});

// TODO: Add support for IE / Edge
// TODO: Persist imported and edited plans in local storage
export const App = React.memo(() => {
  const defaultSelectedPlanId = Object.keys(initialPlans)[0];
  const defaultSelectedPlan = initialPlans[defaultSelectedPlanId];
  const defaultGoalDate = addDays(
    new Date(),
    defaultSelectedPlan.workouts.length - 1
  ).toDateString();

  const [plans, setPlans] = useState(initialPlans);
  const [selectedPlanId, setSelectedPlanId] = useState(defaultSelectedPlanId);
  const [displayUnits, setDisplayUnits] = useState<Units>(
    defaultSelectedPlan.units
  );
  const [displayMode, setDisplayMode] = useState<Mode>(DEFAULT_DISPLAYMODE);
  const [goalDate, setGoalDate] = useState(defaultGoalDate);

  const date = useMemo(() => new Date(goalDate), [goalDate]);
  const plansArray = useMemo(() => Object.values(plans), [plans]);
  const toggleDisplayMode = useCallback(
    () => setDisplayMode(displayMode === "view" ? "edit" : "view"),
    [displayMode, setDisplayMode]
  );
  const savePlan = useCallback(
    (id: string, title: string, workouts: Workout[]) => {
      setPlans({
        ...plans,
        [id]: {
          ...plans[id],
          title: title,
          workouts,
        },
      });
    },
    [plans, setPlans]
  );

  return (
    <>
      <Settings
        plans={plansArray}
        selectedPlan={selectedPlanId}
        onPlanChange={setSelectedPlanId}
        date={date}
        units={displayUnits}
        displayMode={displayMode}
        onDateChange={setGoalDate}
        onUnitsChange={setDisplayUnits}
        onDownload={() => {}} // TODO: Implement
        onFileChange={() => {}} // TODO: Implement
      />
      <Plan
        {...plans[selectedPlanId]}
        displayUnits={displayUnits}
        goalDate={goalDate}
        savePlan={savePlan}
        mode={displayMode}
        toggleEdit={toggleDisplayMode}
      />
    </>
  );
});

export default App;
