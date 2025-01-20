/**
 * This file was generated by kysely-codegen.
 * Please do not edit it manually.
 */

import type { ColumnType } from "kysely";

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export interface Objectives {
  createdAt: Timestamp;
  creatorid: string;
  description: string | null;
  id: Generated<string>;
  isCompleted: boolean | null;
  notifyAt: Timestamp | null;
  title: string;
  updatedAt: Timestamp;
}

export interface UserObjectiveShares {
  id: Generated<string>;
  objectiveId: string;
  userId: string;
}

export interface Users {
  email: string;
  id: Generated<string>;
  login: string;
  name: string;
  password: string;
}

export interface DB {
  objectives: Objectives;
  "user-objective-shares": UserObjectiveShares;
  users: Users;
}