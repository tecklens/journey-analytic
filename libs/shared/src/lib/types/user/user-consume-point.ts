import {UserPlan} from "./user-plan.enum";

export const consumePoints = {
  [UserPlan.free]: 1000000,
  [UserPlan.silver]: 10000,
  [UserPlan.gold]: 1000,
  [UserPlan.diamond]: 100,
};

export const consumeSecondPoints = {
  [UserPlan.free]: 100,
  [UserPlan.silver]: 10,
  [UserPlan.gold]: 1,
  [UserPlan.diamond]: 1,
};