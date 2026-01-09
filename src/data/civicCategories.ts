export type SubCategory = {
  id: string;
  labelKey: string;
};

export type Category = {
  id: string;
  labelKey: string;
  subcategories: SubCategory[];
};

export const CIVIC_CATEGORIES: Record<"100" | "128", Category[]> = {
  "100": [
    {
      id: "american_government",
      labelKey: "categories.american_government",
      subcategories: [
        {
          id: "principles_of_democracy",
          labelKey: "subcategories.principles_of_democracy",
        },
        {
          id: "system_of_government",
          labelKey: "subcategories.system_of_government",
        },
        {
          id: "rights_and_responsibilities",
          labelKey: "subcategories.rights_and_responsibilities",
        },
      ],
    },
    {
      id: "american_history",
      labelKey: "categories.american_history",
      subcategories: [
        {
          id: "colonial_and_independence",
          labelKey: "subcategories.colonial_and_independence",
        },
        {
          id: "1800s",
          labelKey: "subcategories.1800s",
        },
        {
          id: "recent_history",
          labelKey: "subcategories.recent_history",
        },
      ],
    },
    {
      id: "integrated_civics",
      labelKey: "categories.integrated_civics",
      subcategories: [
        { id: "geography", labelKey: "subcategories.geography" },
        { id: "symbols", labelKey: "subcategories.symbols" },
        { id: "holidays", labelKey: "subcategories.holidays" },
      ],
    },
  ],

  "128": [
    {
      id: "american_government",
      labelKey: "categories.american_government",
      subcategories: [
        {
          id: "principles_of_government",
          labelKey: "subcategories.principles_of_government",
        },
        {
          id: "system_of_government",
          labelKey: "subcategories.system_of_government",
        },
        {
          id: "rights_and_responsibilities",
          labelKey: "subcategories.rights_and_responsibilities",
        },
      ],
    },
    {
      id: "american_history",
      labelKey: "categories.american_history",
      subcategories: [
        {
          id: "colonial_and_independence",
          labelKey: "subcategories.colonial_and_independence",
        },
        { id: "1800s", labelKey: "subcategories.1800s" },
        {
          id: "recent_history",
          labelKey: "subcategories.recent_history",
        },
      ],
    },
    {
      id: "symbols_and_holidays",
      labelKey: "categories.symbols_and_holidays",
      subcategories: [
        { id: "symbols", labelKey: "subcategories.symbols" },
        { id: "holidays", labelKey: "subcategories.holidays" },
      ],
    },
  ],
};
