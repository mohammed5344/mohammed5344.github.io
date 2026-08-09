import { getCookie } from "../helpers/cookies.js";
import { fillBattery } from "./battery.js";


export async function getData() {
    const token = getCookie("token");
    if (!token) {
        console.error('could not read token');
        return;
    }

    try {
        const resp = await fetch("https://learn.reboot01.com/api/graphql-engine/v1/graphql", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                query: `
                    {
                        transaction(
                            where: {
                            object: {
                                type: { _eq: "project" }
                            }
                            type: { _in: ["xp", "down", "up"] }
                            }
                        ) {
                            type
                            amount
                            objectId
                            object {
                            type
                            name
                            }
                        }

                        progress(
                            where: {
                            isDone: { _eq: false }
                            object: {
                                type: { _eq: "project" }
                            }
                            }
                            order_by: { updatedAt: desc }
                            limit: 1
                        ) {
                            object {
                            name
                            }
                        }
                        audit(
                            where: {auditor: {login: {_eq: "malmadhoo"}}, grade: {_is_null: false}}
                            order_by: {updatedAt: desc}
                            limit: 2
                        ) {
                            group {
                            captain {
                                login
                            }
                            object {
                                name
                            }
                            }
                        }

                        skillTransactions: transaction(
                            where: { type: { _like: "skill_%" } }
                            order_by: { createdAt: desc }
                        ) {
                            id
                            type
                            amount
                            createdAt
                            object {
                                id
                                name
                                type
                            }
                        }
                    }
                `,
            }),
        });

        const { data, errors } = await resp.json();
        if (errors) {
            console.error(errors);
            return null;
        }

        const totals = data.transaction.reduce(
            (acc, t) => {
                acc[t.type] += t.amount;
                return acc;
            },
            { up: 0, down: 0 }
        );

        const ratio = totals.down === 0 ? 0 : totals.up / totals.down;
        fillBattery(ratio);

        return data;

    } catch (err) {
        console.error(err)
    }

}