import Knex from "knex";
import { Model } from "objection";

import { knex } from "../../knex";

Model.knex(Knex(knex));
