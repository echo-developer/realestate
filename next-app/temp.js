const selectedCity = "Kolkata";
const menuData = [
    {
      name: "Buy",
      options: [
        {
          name: "Popular Choices",
          links: [
            { text: "Ready to Move", url: "#" },
            { text: "Owner Properties", url: "#" },
            { text: "Budget Homes", url: "#" },
            { text: "New Projects", url: "#"}
          ],
        },
        {
          name: "Property Types",
          links: [
            { text: `Flat for in ${selectedCity||""} `, url: "#" },
            { text: `Flat for in ${selectedCity||""} `, url: "#" },
            { text: `Flat for in ${selectedCity||""} `, url: "#" },
            { text: `Flat for in ${selectedCity||""} `, url: "#" },
            { text: `Flat for in ${selectedCity||""} `, url: "#" },
            { text: `Flat for in ${selectedCity||""} `, url: "#" },
            { text: `Flat for in ${selectedCity||""} `, url: "#" },
          ],
        },
        {
            name: "Budget",
            links: [
                {text: "Under AED 399.00", url: "#"},
                {text: "AED400.00 - AED699.00", url: "#"},
                {text: "AED700.00 - AED1199.00", url: "#"},
                {text: "AED1200.00 - AED1599.00", url: "#"},
                {text: "Above AED1600.00", url: "#"},
            ]
        },
        {
            name: "Explore",
            links: [
                {text: "Find an Agent", url: "#"},
                {text: "Find an Agent", url: "#"},
                {text: "Find an Agent", url: "#"},
                {text: "Find an Agent", url: "#"},
            ]
        }
      ],
    },
    {
        name: "Rent",
        options: [
          {
            name: "Popular Choices",
            links: [
              { text: "Owner Properties", url: "#" },
              { text: "Furnished Properties", url: "#" },
              { text: "Semi Furnished Properties", url: "#" },
              { text: "Immediately Available", url: "#" },
            ],
          },
          {
            name: "Property Types",
            links: [
              { text: `Flat for rent in ${selectedCity||""}`, url: "#" },
              { text: `Villa for rent in ${selectedCity||""}`, url: "#" },
              { text: `Residential House for rent in ${selectedCity||""}`, url: "#" },
              { text: `Offices for rent in ${selectedCity||""}`, url: "#" },
              { text: `Commercial Office Space for rent in ${selectedCity||""}`, url: "#" },
              { text: `Builder Floor Apartment for rent in ${selectedCity||""}`, url: "#" },
              { text: `Office in IT Park\/ SEZ for rent in ${selectedCity||""}`, url: "#" },
            ],
          },
          {
              name: "Budget",
              links: [
                  {text: "Under AED 399.00", url: "#"},
                  {text: "AED400.00 - AED699.00", url: "#"},
                  {text: "AED700.00 - AED1199.00", url: "#"},
                  {text: "AED1200.00 - AED1599.00", url: "#"},
                  {text: "Above AED1600.00", url: "#"},
              ]
          },
          {
              name: "Explore",
              links: [
                  {text: "Find an Agent", url: "#"},
                  {text: "Localities", url: "#"},
                  {text: "Share Requirement", url: "#"},
                  {text: "Property Services", url: "#"},
                  {text: "Rent Agreement", url: "#"},
              ]
          },
  
        ],
      },
    {
      name: "Sell",
      options: [
        {
            name: "For Owner",
            links: [
                {text: "Post Property Free", url: "#"},
                {text: "My Dashboard", url: "#"},
                {text: "Sell / Rent Ad Packages", url: "#"},

            ]
        },
        {
            name: "For Agent & Builder",
            links: [
                {text: "My Dashboard", url: "#"},
                {text: "Ad Packages", url: "#"},
                {text: "Sales Enquiry", url: "#"},
            ]
        },
        {
            name: "Selling Tools",
            links: [
                {text: "Property Valuation", url: "#"},
                {text: "Find an Agent", url: "#"},
                {text: "Rates & Trends", url: "#"},
            ]
        }
      ],
    },

    {
      name: "Help",
      options: [
        { text: "Help Center", url: "#" },
        { text: "Sales Enquiry", url: "#" },
      ],
    },
  ];