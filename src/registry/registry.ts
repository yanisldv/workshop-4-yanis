import bodyParser from "body-parser";
import express from "express";
import { REGISTRY_PORT } from "../config";

export type Node = {
    nodeId: number;
    pubKey: string;
};

export type RegisterNodeBody = {
    nodeId: number;
    pubKey: string;
};

export type GetNodeRegistryBody = {
    nodes: Node[];
};

const nodeRegistry: GetNodeRegistryBody = {
    nodes: [],
};

export async function launchRegistry() {
    const _registry = express();
    _registry.use(express.json());
    _registry.use(bodyParser.json());

    _registry.get("/status", (_, res) => {
        res.status(200).send("live");
    });

    _registry.post("/registerNode", async (req, res) => {
        const { nodeId, pubKey } = req.body
        if (!nodeRegistry.nodes.find((n) => n.nodeId === nodeId))
            nodeRegistry.nodes.push({ nodeId, pubKey });
        res.status(200).send("Node registered");
    });

    _registry.get("/getNodeRegistry", (_, res) => {
        res.status(200).send(nodeRegistry);
    });

    return _registry.listen(REGISTRY_PORT, () => {});
}
