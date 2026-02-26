import { z } from "zod";
import DonutChart from "@/components/DonutChart/DonutChart";
import SummaryGrid from "@/components/SummaryGrid/SummaryGrid";
import RankList from "@/components/RankList/RankList";

const donutChartSchema = {
  type: "object" as const,
  properties: {
    segments: {
      type: "array" as const,
      items: {
        type: "object" as const,
        properties: {
          colorVar: { type: "string" as const, description: "CSS variable name like --chart-1" },
          percentage: { type: "number" as const },
          label: { type: "string" as const },
          legendValue: { type: "string" as const },
        },
        required: ["colorVar", "percentage", "label"],
      },
    },
    totalLabel: { type: "string" as const },
  },
  required: ["segments"],
};

const summaryGridSchema = {
  type: "object" as const,
  properties: {
    items: {
      type: "array" as const,
      items: {
        type: "object" as const,
        properties: {
          title: { type: "string" as const },
          value: { type: "string" as const },
        },
        required: ["title", "value"],
      },
    },
  },
  required: ["items"],
};

const rankListSchema = {
  type: "object" as const,
  properties: {
    items: {
      type: "array" as const,
      items: {
        type: "object" as const,
        properties: {
          name: { type: "string" as const },
          value: { type: "number" as const },
          color: { type: "string" as const },
        },
        required: ["name", "value", "color"],
      },
    },
  },
  required: ["items"],
};

void z;

export const tamboComponents = [
  {
    name: "DonutChart",
    description:
      "Displays data as a donut/pie chart with colored segments and a center label. Use for asset allocation, risk distribution, or any percentage breakdown.",
    component: DonutChart,
    propsSchema: donutChartSchema,
  },
  {
    name: "SummaryGrid",
    description:
      "Displays a grid of KPI cards with title-value pairs. Use for showing filtered results, key metrics, or summary statistics.",
    component: SummaryGrid,
    propsSchema: summaryGridSchema,
  },
  {
    name: "RankList",
    description:
      "Displays a ranked list with horizontal bar charts showing relative values. Use for top protocols, chain distributions, or any ranked data.",
    component: RankList,
    propsSchema: rankListSchema,
  },
];
