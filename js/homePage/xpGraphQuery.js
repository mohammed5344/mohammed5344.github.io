import { getCookie } from "../helpers/cookies.js";

// fetch data for the piscines in the progress graph
export async function fetchPiscineTransactions() {
    const token = getCookie("token");
    if (!token) {
        throw new Error("missing auth token");
    }

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
                        order_by: {createdAt: desc}
                        where: {object: {type: {_eq: "exercise"}}}
                    ) {
                        amount
                        type
                        createdAt
                        object {
                            type
                            name
                            paths {
                                path
                            }
                        }
                    }
                }
            `,
        }),
    });

    if (!resp.ok) {
        throw new Error(`request failed with status ${resp.status}`);
    }

    const { data, errors } = await resp.json();

    if (errors) {
        throw new Error("graphql error");
    }

    if (!data || !Array.isArray(data.transaction)) {
        return [];
    }

    return data.transaction;
}
