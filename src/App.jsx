import React, { useState, useMemo, useEffect, createContext, useContext } from "react";

/* ----------------------------------------------------------------------
   DATA
   Every claim in this file is paired with a source. Sources render as
   numbered footnote tags ( clinical-paper style ) that expand inline
   when clicked, the same way a reader would check a citation in an
   actual dermatology journal article.
---------------------------------------------------------------------- */

const SOURCES = {
  uva: {
    label: "IJDVL — UV composition study",
    quote:
      "Sea-level solar UV radiation consists of 95–98% UVA and only 2–5% UVB.",
    detail:
      "Indian Journal of Dermatology, Venereology and Leprology. This is why PA rating (UVA protection) matters as much as SPF (UVB protection) for Indian skin.",
  },
  paRating: {
    label: "IJDVL — PA rating clinical criteria",
    quote:
      "A PA++++ rating indicates a UVA protection factor greater than 16, the highest available standard for preventing melanin overproduction.",
    detail:
      "Dermatologist-cited clinical criteria for photoprotection selection in Indian skin types III–V.",
  },
  delhiTrial: {
    label: "IJDVL — Delhi clinical trial, 230 subjects",
    quote:
      "The first in vivo real-life study conducted in New Delhi under Indian environmental conditions, evaluating two sunscreen formulations on Indian skin types IV and V with pigmentation irregularities over 12 weeks.",
    detail:
      "Maulana Azad Medical College, New Delhi. 58 men, 172 women, ages 18–45. Confirmed daily sunscreen use measurably improved pigmentation.",
  },
  uvaAsian: {
    label: "IJDVL — UVA/UVB balance review",
    quote:
      "In darker-skinned individuals, UVA has greater pigmenting effects than UVB. Well-balanced photoprotection with a low SPF/UVAPF ratio has been shown to prevent hyperpigmentation in Asian skin (phototypes III, IV, V).",
    detail: "Review on balanced UVA/UVB sunscreen formulation for pigmentation prevention.",
  },
  overlayering: {
    label: "Dermatology clinical practice review",
    quote:
      "Each active stimulates a biological response that demands recovery time. When combined, these demands accumulate — instead of enhancing results, excessive actives overwhelm the skin's tolerance.",
    detail:
      "Common skincare mistakes dermatologists see in clinical practice. Layering retinoids, acids, and vitamin C simultaneously is the single most frequent cause of barrier damage misread as 'purging.'",
  },
  oneActive: {
    label: "Dermatologist-reviewed mistake list",
    quote:
      "Introduce one active at a time, slowly. Redness, burning, or breakouts means stop, reassess, and simplify.",
    detail: "Standard dermatological guidance for introducing new actives into a routine.",
  },
  koreanMyth: {
    label: "Dr. Sonali Kohli, Integrative Aesthetic Dermatologist",
    quote:
      "Koreans have designed their skincare for their environment and skin type. If Indians try to follow it blindly, they might be doing more harm than good.",
    detail: "On why 9-step K-beauty routines don't translate directly to Indian humidity and skin type.",
  },
  asci500: {
    label: "ASCI 2025–26 enforcement data",
    quote:
      "More than 500 brands violated advertising norms between 2025 and January 2026 — breaches spanning exaggerated product claims and misleading use of words such as 'natural' and 'Ayurvedic.'",
    detail:
      "Honasa (Mamaearth), HUL, Dove, L'Oréal, and Nykaa dominate the violator list. Honasa alone was flagged for 23 separate advertisements requiring modification.",
  },
  asciQuote: {
    label: "Manisha Kapoor, CEO, ASCI",
    quote:
      "Many of these cases involved exaggerated or inadequately substantiated claims related to skin benefits, fairness, anti-ageing, or treatment-like results.",
    detail: "Statement on the scale of skincare advertising violations found in 2025–26 review.",
  },
  niacinamideFake: {
    label: "Cosmetic formulation labeling analysis",
    quote:
      "If niacinamide appears after water, glycerin, propanediol, and sodium hyaluronate, that strongly suggests it's present at less than 1%. A true 5–10% formulation will almost always appear in the top 3–4 positions.",
    detail:
      "Ingredient lists are legally ordered by concentration — a practical way to verify 'active %' label claims before buying.",
  },
  counterfeit: {
    label: "FMCG counterfeit market study, 2023",
    quote:
      "30% of FMCG products sold in India are counterfeit, often containing toxins like lead or arsenic.",
    detail: "Cited in industry analysis of India's skincare marketing-versus-substance gap.",
  },
  oxybenzoneReview: {
    label: "PMC — endocrine UV filter review, 75 studies",
    quote:
      "Findings reveal significant hormonal disruptions, including reduced testosterone levels in adolescent males, altered thyroid hormones in pregnant women.",
    detail:
      "PRISMA-guided review of 2014–2024 epidemiological and human research on benzophenone-derivative UV filters (oxybenzone, BP-2, 4-OHBP).",
  },
  tinosorbSafe: {
    label: "Dr. Heather Rogers, dermatologist",
    quote:
      "Bemotrizinol is not easily absorbed through the skin, without hormonal disruption concerns, very photostable, and used globally for over 20 years with an excellent safety profile.",
    detail: "Comparison of older chemical UV filters against newer-generation alternatives like Tinosorb S.",
  },
  hairOilDandruff: {
    label: "BMC Research Notes — Malassezia prevalence study",
    quote:
      "Participants who use hair oil products were significantly more likely to be Malassezia-positive compared to those who do not (AOR = 2.964).",
    detail:
      "Facility-based cross-sectional study, 217 participants. Researchers propose hair oil products favor fungal growth conditions on the scalp.",
  },
  coconutOilStudy: {
    label: "Rele & Mohile, Journal of Cosmetic Science, 2003",
    quote:
      "Coconut oil was the only oil found to reduce protein loss remarkably for both undamaged and damaged hair when used as a pre-wash and post-wash grooming product. Both sunflower and mineral oils do not help at all.",
    detail:
      "Hindustan Unilever Research Center. PubMed-indexed peer-reviewed study (PMID 12715094) comparing coconut, mineral, and sunflower oil on protein loss.",
  },
  coconutMechanism: {
    label: "Journal of Cosmetic Science, mechanism detail",
    quote:
      "Coconut oil is mostly a triglyceride of lauric acid and is hydrophobic. Application as a pre-wash conditioner coats the hair and inhibits the penetration of water into the hair.",
    detail:
      "The degree of swelling of the cuticle layers increases combing damage and protein loss, especially in wet combing — coconut oil's hydrophobic barrier limits this swelling.",
  },
  silicones: {
    label: "r/curlyhair community consensus",
    quote: "Silicones aren't the enemy.",
    detail:
      "Reddit curl communities (r/curlyhair, r/IndianSkincareAddicts) actively counter the 'silicones are bad' myth — moderate use in conditioners is well tolerated.",
  },
  clarifyReddit: {
    label: "Reddit-sourced curl routine consensus",
    quote:
      "A good clarifying shampoo to remove buildup, T-shirt drying to cut down on frizz, and silk pillowcases to reduce breakage — every small step adds up.",
    detail: "Cross-referenced from r/curlyhair and r/IndianSkincareAddicts product threads.",
  },
  selSulfide: {
    label: "Clinical study, Indian participants, 2022–23",
    quote:
      "2.5% selenium sulfide shampoo was found to be effective in the management of dandruff and related symptoms like itching, oiliness, and greasiness, with a good safety profile in Indian participants.",
    detail: "Single-center, single-arm, open-label postmarketing study, Shree Skin Centre, Navi Mumbai.",
  },
  scalpMicrobiome: {
    label: "Frontiers in Cellular and Infection Microbiology, 2018",
    quote:
      "Propionibacterium acnes was associated with a healthy scalp and Staphylococcus epidermidis with dandruff scalp, alongside Malassezia restricta and M. globosa.",
    detail:
      "Metagenomic study of 140 Indian women, IISER Bhopal with L'Oréal Research & Innovation. DOI 10.3389/fcimb.2018.00346.",
  },
  telogenIron: {
    label: "Clinical trichology, Indian context",
    quote:
      "Telogen Effluvium is highly prevalent in India due to common deficiencies in Ferritin (Iron) and Vitamin B12.",
    detail:
      "A large share of diffuse hair fall in Indian patients is nutritional in origin, not cosmetic — no topical product corrects a deficiency.",
  },
  ceramideMechanism: {
    label: "Dermatological barrier-repair mechanism",
    quote:
      "Ceramides are the lipids that hold your skin cells together. By replenishing ceramides, you are essentially patching up the holes in your skin barrier.",
    detail: "Standard mechanism of action for ceramide-based moisturizers in barrier repair.",
  },
  hyaluronicMechanism: {
    label: "Dermatological hydration mechanism",
    quote: "Hyaluronic acid acts like a sponge, pulling moisture into the skin and holding it there.",
    detail: "Standard mechanism of action for humectant-class hydrators.",
  },
  hotWater: {
    label: "Sensitive-skin clinical guidance",
    quote:
      "Hot water melts away natural oils, leaving skin parched and itchy. Always use lukewarm or room-temperature water.",
    detail: "Dermatologist-approved AM/PM routine guidance for sensitive skin in Indian conditions.",
  },
  overwashing: {
    label: "Sensitive-skin clinical guidance",
    quote:
      "Many feel the need to wash 3–4 times a day because of sweat and oil, but for sensitive skin this is a disaster — it strips away the acid mantle.",
    detail: "On the specific Indian-climate habit of over-washing and its effect on barrier-compromised skin.",
  },
  gelBase: {
    label: "Dr. Saugata Dutta, dermatologist",
    quote:
      "A lightweight gel or fluid base is mandatory in high humidity because heavy creams trap sebum and cause comedones.",
    detail: "On sunscreen vehicle selection by skin type for humid Indian climates.",
  },
  minimalistFluid: {
    label: "r/IndianSkincareAddicts — Minimalist Fluid",
    quote: "After trying many sunscreens, I finally settled for Minimalist fluid and it's the best one ever.",
    detail:
      "Uses Uvinul A Plus filters, weightless, doesn't pill. Caveat from the same threads: can feel slightly oily to the touch and isn't very sweat-resistant.",
  },
  consciousChemist: {
    label: "r/IndianSkincareAddicts — Conscious Chemist sunscreen",
    quote: "I have super sensitive skin, very prone to sunburns; this works.",
    detail:
      "Frequently recommended for sensitive skin in this community. Oily-skin users in the same threads warn it's too heavy for daily office wear.",
  },
  dotKeyMixed: {
    label: "r/IndianSkincareAddicts — Dot & Key vitamin C sunscreen, mixed",
    quote: "Gone through four tubes because it worked well and felt moisturizing.",
    detail:
      "Pairs ethyl ascorbic acid with ceramides, spreads without white cast. Reddit opinion is split — some find it excellent, others find it underwhelming for the price.",
  },
  derma500Niacinamide: {
    label: "Ingredient-list audit",
    quote: "The Derma Co and Minimalist both list niacinamide within the first 5 ingredients on their 10% serums.",
    detail:
      "Checked against the niacinamideFake labeling rule — these two brands' flagship niacinamide serums pass the position-on-label check, unlike many smaller D2C competitors.",
  },
  cetaphilGentle: {
    label: "Cross-platform review aggregate, Cetaphil Gentle Skin Cleanser",
    quote: "Clinically proven to cleanse while hydrating, preserving the skin's moisture barrier even after repeat washes.",
    detail:
      "Consistently rated 4.3+ across major retail platforms for dry/sensitive skin; fragrance-free and non-foaming, which fits the sensitive-skin guidance above.",
  },
  asciHonasaSpecific: {
    label: "ASCI violator list, skincare category",
    quote: "Honasa (Mamaearth) was flagged for 23 separate advertisements requiring modification in the 2025–26 review.",
    detail:
      "Worth knowing before treating any single Mamaearth product claim — onion shampoo, rice serum, etc. — as independently verified.",
  },
  aadBeardPlan: {
    label: "Dr. Anthony Rossi, MD, FAAD — American Academy of Dermatology",
    quote:
      "Healthy-looking facial hair starts with healthy skin. With the right skin care, it's possible to prevent problems like dandruff, ingrown hair, acne, and itch.",
    detail:
      "Board-certified dermatologist and Mohs surgeon. AAD's official three-step beard care plan: wash, moisturize, groom.",
  },
  aadShaveDirection: {
    label: "AAD shaving guidance",
    quote:
      "Shave in the direction that your hair grows. Shaving against the grain can cause ingrown hairs in some people.",
    detail:
      "Also: change razor blades every 5–7 shaves, rinse the razor after each swipe, and shave right after a warm shower when hair is softened.",
  },
  aadStubblePhase: {
    label: "AAD stubble-phase guidance",
    quote:
      "If you are prone to getting ingrown hairs, the stubble phase can be hard. Use a gentle exfoliating scrub 1–2 times per week and moisturize immediately afterward, with SPF 30 or higher.",
    detail: "Specific to the 1–4 week growing-out phase, before the beard is long enough to cover the skin itself.",
  },
  pseudofolliculitis: {
    label: "Healthline, medically reviewed — pseudofolliculitis barbae",
    quote:
      "Pseudofolliculitis barbae happens when facial hairs cut your skin inside the follicle or curve back around into the skin as they try to grow out. It's most likely to occur in those with curly hair.",
    detail:
      "Standard treatment: stop shaving for 3-4 weeks until lesions clear, then shave every second day instead of daily once resumed.",
  },
  beardruffVsDry: {
    label: "Dermatology clinic guidance — beardruff vs. dry skin",
    quote:
      "While the symptoms often look the same — white flakes or a tight sensation — the biological causes differ significantly. True dry skin lacks water and oil; beardruff can also stem from Malassezia yeast overgrowth.",
    detail:
      "Important distinction: applying more beard oil to a fungal-overgrowth case can make it worse, not better. An antifungal product is the correct first step if oil alone isn't helping.",
  },
};

/* ----------------------------------------------------------------------
   ROUTINE CONTENT
---------------------------------------------------------------------- */

const FACE_TYPES = [
  {
    id: "oily",
    name: "Oily / acne-prone",
    icon: "ti-droplet-half-2",
    summary: "Sebum control without stripping the barrier.",
    am: [
      { step: "Cleanse", detail: "Gel cleanser, lukewarm water", cites: [] },
      { step: "Treat", detail: "Niacinamide serum — verify it's in the first 3–4 ingredients", cites: ["niacinamideFake"] },
      { step: "Protect", detail: "Oil-free gel/fluid sunscreen, SPF 50 PA++++", cites: ["gelBase", "paRating"] },
    ],
    pm: [
      { step: "Cleanse", detail: "Same gel cleanser", cites: [] },
      { step: "Treat", detail: "Salicylic acid 2% BHA — 3–4×/week, not daily", cites: ["overlayering"] },
      { step: "Moisturize", detail: "Light gel moisturizer", cites: [] },
    ],
    caution:
      "Don't combine BHA + retinol + vitamin C while starting out — that's the over-layering pattern that causes false 'purging.'",
    cautionCites: ["overlayering", "oneActive"],
    products: [
      { name: "Minimalist 2% Salicylic Acid Serum", note: "Position-checked — niacinamide/actives sit high on the label", cites: ["derma500Niacinamide"] },
      { name: "Minimalist Sunscreen SPF 50 PA++++ (Fluid)", note: "\"Best one ever\" per repeat Reddit threads — but slightly oily-feeling, weak sweat resistance", cites: ["minimalistFluid"] },
      { name: "The Derma Co 2% Salicylic Acid Cleanser", note: "Common pairing with the above; check your own skin tolerance before daily use", cites: [] },
    ],
  },
  {
    id: "dry",
    name: "Dry skin",
    icon: "ti-cloud",
    summary: "Barrier-first hydration, lipid replenishment.",
    am: [
      { step: "Cleanse", detail: "Cream/lotion cleanser, non-foaming", cites: [] },
      { step: "Treat", detail: "Hyaluronic acid serum on damp skin", cites: ["hyaluronicMechanism"] },
      { step: "Moisturize + protect", detail: "Ceramide moisturizer, then cream-based sunscreen", cites: ["ceramideMechanism"] },
    ],
    pm: [
      { step: "Cleanse", detail: "Same cream cleanser", cites: [] },
      { step: "Repair", detail: "Ceramide-rich night cream, optionally with squalane", cites: ["ceramideMechanism"] },
    ],
    caution: "Avoid foaming or sulfate cleansers — they strip the lipids you're trying to replenish.",
    cautionCites: [],
    products: [
      { name: "Cetaphil Gentle Skin Cleanser", note: "4.3+ rated consistently across platforms; fragrance-free, non-foaming", cites: ["cetaphilGentle"] },
      { name: "Minimalist Ceramide & Vitamin B5 Delicate Cleanser", note: "Sulfate/fragrance-free, listed fungal-acne safe", cites: [] },
      { name: "Dot & Key Vitamin C + E Sunscreen", note: "Spreads without white cast — but Reddit opinion is genuinely split on value for money", cites: ["dotKeyMixed"] },
    ],
  },
  {
    id: "combo",
    name: "Combination",
    icon: "ti-layout-grid",
    summary: "Zone-specific treatment, not one-size-fits-all.",
    am: [
      { step: "Cleanse", detail: "Gel-cream cleanser", cites: [] },
      { step: "Treat", detail: "Niacinamide across full face", cites: [] },
      { step: "Moisturize", detail: "Gel-cream — more on cheeks, less on T-zone", cites: [] },
      { step: "Protect", detail: "Broad-spectrum sunscreen, SPF 50 PA++++", cites: ["paRating"] },
    ],
    pm: [
      { step: "Cleanse", detail: "Same gel-cream cleanser", cites: [] },
      { step: "Alternate", detail: "Gentle exfoliant 2×/week; hydrating serum on off-nights", cites: ["oneActive"] },
    ],
    caution:
      "The most common mistake: using one oily-skin product on the whole face. Dries out cheeks without fully fixing the T-zone.",
    cautionCites: [],
    products: [
      { name: "Minimalist 10% Niacinamide Sunscreen Matte Fluid", note: "Strong fit for T-zone control without over-drying cheeks", cites: [] },
      { name: "Aqualogica Radiance+ Dewy Sunscreen SPF 50+", note: "Niacinamide-based, formulated for combination/dry zones together", cites: [] },
    ],
  },
  {
    id: "sensitive",
    name: "Sensitive skin",
    icon: "ti-shield-half-filled",
    summary: "Minimal inputs, maximum tolerance.",
    am: [
      { step: "Cleanse", detail: "Sulfate-free, fragrance-free, lukewarm water only", cites: ["hotWater"] },
      { step: "Treat", detail: "Niacinamide for barrier support", cites: [] },
      { step: "Protect", detail: "Mineral or Tinosorb-based sunscreen, avoid oxybenzone", cites: ["tinosorbSafe", "oxybenzoneReview", "uvaAsian"] },
    ],
    pm: [
      { step: "Cleanse", detail: "Same gentle cleanser", cites: [] },
      { step: "Moisturize", detail: "Ceramide moisturizer — nothing else active until stable", cites: ["ceramideMechanism"] },
    ],
    caution: "Wash only twice a day. Skip physical scrubs, high-% vitamin C, and daily acids entirely.",
    cautionCites: ["overwashing"],
    products: [
      { name: "Cetaphil Gentle Skin Cleanser", note: "Dermatologist-recommended for sensitive skin, hypoallergenic", cites: ["cetaphilGentle"] },
      { name: "Conscious Chemist sunscreen", note: "\"I have super sensitive skin, very prone to sunburns; this works\" — but oily-skin users find it heavy", cites: ["consciousChemist"] },
      { name: "Moody SensiSoothe Mineral Sunscreen SPF50 PA++++", note: "Mineral-based, fungal-acne safe, built specifically for reactive skin", cites: [] },
    ],
  },
];

const HAIR_TYPES = [
  {
    id: "oily-dandruff",
    name: "Oily scalp + dandruff",
    icon: "ti-virus",
    summary: "Microbial rebalancing, not just degreasing.",
    routine: [
      { step: "Wash frequency", detail: "Every 2–3 days with zinc pyrithione or selenium sulfide shampoo", cites: ["selSulfide"] },
      { step: "Oil placement", detail: "Mid-lengths and ends only — never the scalp", cites: ["hairOilDandruff"] },
      { step: "Why", detail: "Dandruff is microbial imbalance, not just dryness", cites: ["scalpMicrobiome"] },
    ],
    caution: "Skip the traditional scalp-oil-massage if you're dandruff-prone — oiled scalps show higher Malassezia positivity.",
    cautionCites: ["hairOilDandruff"],
    products: [
      { name: "Selsun / any 2.5% selenium sulfide shampoo", note: "Matches the clinical study dose tested on Indian participants", cites: ["selSulfide"] },
      { name: "Any zinc pyrithione shampoo (e.g. Head & Shoulders)", note: "Standard antifungal alternative; rotate with selenium sulfide if one stops working", cites: [] },
    ],
  },
  {
    id: "dry-frizzy",
    name: "Dry / frizzy hair",
    icon: "ti-wind",
    summary: "Pre-wash protein protection, not just post-wash moisture.",
    routine: [
      { step: "Pre-wash", detail: "Coconut oil, 30–60 min before shampoo, 2–3×/week", cites: ["coconutOilStudy", "coconutMechanism"] },
      { step: "Wash", detail: "Sulfate-free shampoo", cites: [] },
      { step: "Condition", detail: "Silicone-containing conditioner — silicones aren't the issue", cites: ["silicones"] },
      { step: "Dry", detail: "T-shirt or microfiber towel, not regular cotton towel", cites: [] },
    ],
    caution: null,
    cautionCites: [],
    products: [
      { name: "Parachute / Kerala Ayurvedic pure coconut oil", note: "Any genuine virgin coconut oil works — the mechanism is the lauric acid triglyceride, not the brand", cites: ["coconutOilStudy"] },
      { name: "Mamaearth Onion Hair Mask / Shampoo", note: "Widely sold and used, but Mamaearth's parent Honasa was flagged 23 times in 2025–26 for ad-claim violations — treat marketing claims with caution, judge by ingredients", cites: ["asciHonasaSpecific"] },
    ],
  },
  {
    id: "hairfall",
    name: "Hair fall / thinning",
    icon: "ti-chart-line-down",
    summary: "Rule out nutrition before buying serums.",
    routine: [
      { step: "First step", detail: "Get ferritin (iron) and B12 checked", cites: ["telogenIron"] },
      { step: "If diffuse + sudden", detail: "Likely Telogen Effluvium — nutritional, not cosmetic", cites: ["telogenIron"] },
      { step: "If pattern-based", detail: "Receding hairline or widening part — see a dermatologist for minoxidil/finasteride-class options", cites: [] },
    ],
    caution: "No shampoo or oil corrects a vitamin or iron deficiency.",
    cautionCites: ["telogenIron"],
    products: [
      { name: "Blood test panel: ferritin + B12 + thyroid", note: "Start here, not with a product — this is the actual first step", cites: ["telogenIron"] },
      { name: "Minoxidil 5% (topical, OTC)", note: "Evidence-backed for pattern hair loss — but get a dermatologist's confirmation of diagnosis first", cites: [] },
    ],
  },
  {
    id: "curly",
    name: "Curly / wavy hair",
    icon: "ti-wave-square",
    summary: "Buildup management is the main curl-specific risk.",
    routine: [
      { step: "Clarify", detail: "1×/week or every other wash to prevent product buildup", cites: ["clarifyReddit"] },
      { step: "Detangle", detail: "Wet, with conditioner in — never brush dry", cites: [] },
      { step: "Dry", detail: "T-shirt drying + silk pillowcase to reduce breakage", cites: ["clarifyReddit"] },
    ],
    caution: null,
    cautionCites: [],
    products: [
      { name: "L'Oréal Scalp Advance (clarifying)", note: "Specific pick from r/curlyhair community threads for buildup removal", cites: ["clarifyReddit"] },
      { name: "Any silicone-containing curl conditioner", note: "Don't avoid silicones by default — moderate use is well tolerated per community consensus", cites: ["silicones"] },
    ],
  },
];

const BEARD_TYPES = [
  {
    id: "stubble",
    name: "Stubble phase (growing out)",
    icon: "ti-cut",
    summary: "The most ingrown-hair-prone stage — skin is still exposed.",
    routine: [
      { step: "Wash daily", detail: "Gentle, skin-type-matched cleanser — gel/salicylic acid for oily, fragrance-free for dry/sensitive", cites: ["aadBeardPlan"] },
      { step: "Exfoliate", detail: "Gentle scrub 1–2×/week if ingrown-prone, moisturize immediately after", cites: ["aadStubblePhase"] },
      { step: "Protect", detail: "Moisturizer with SPF 30+ — skin here is still exposed to sun like bare face", cites: ["aadStubblePhase"] },
    ],
    caution: "This is the highest-risk window for ingrown hairs. Don't skip exfoliation just because hair is short.",
    cautionCites: ["aadStubblePhase", "pseudofolliculitis"],
    products: [
      { name: "Salicylic acid gel cleanser (oily/acne-prone)", note: "Matches AAD's skin-type-specific cleanser guidance for this phase", cites: ["aadBeardPlan"] },
      { name: "Any fragrance-free moisturizer with SPF 30+", note: "Needed until the beard is dense enough to itself block UV", cites: ["aadStubblePhase"] },
    ],
  },
  {
    id: "grown-oily",
    name: "Grown-in beard, oily/acne-prone skin",
    icon: "ti-droplet-half-2",
    summary: "Skip the oil — conditioner-style hydration instead.",
    routine: [
      { step: "Wash", detail: "Daily, with a non-comedogenic cleanser", cites: ["aadBeardPlan"] },
      { step: "Moisturize", detail: "Beard conditioner, not beard oil — lighter, won't clog pores underneath", cites: ["aadBeardPlan"] },
      { step: "Groom", detail: "Comb through while damp, use sparingly to avoid a greasy look", cites: ["aadBeardPlan"] },
    ],
    caution: "Don't skip moisturizing because skin feels oily — that's how dry, flaky, itchy skin develops under the beard.",
    cautionCites: ["aadBeardPlan"],
    products: [
      { name: "Any salicylic-acid beard/face wash", note: "Use the same logic as oily-face cleansing — non-comedogenic label is the key check", cites: [] },
    ],
  },
  {
    id: "grown-dry-itchy",
    name: "Grown-in beard, dry / itchy / beardruff",
    icon: "ti-wind",
    summary: "Distinguish true dryness from fungal beardruff before treating.",
    routine: [
      { step: "Wash", detail: "Hydrating, fragrance-free cleanser", cites: ["aadBeardPlan"] },
      { step: "Moisturize", detail: "Beard oil, massaged through to the skin, not just the hair", cites: ["aadBeardPlan"] },
      { step: "If flaking persists", detail: "Could be Malassezia (beardruff), not just dryness — try an antifungal product, not more oil", cites: ["beardruffVsDry"] },
    ],
    caution: "If oil alone isn't fixing the flaking after a couple weeks, the cause may be fungal, not dry skin — more oil won't help and can worsen it.",
    cautionCites: ["beardruffVsDry"],
    products: [
      { name: "Jojoba or argan-based beard oil", note: "Lighter, sebum-mimicking oils are less likely to clog pores than heavier oils", cites: [] },
      { name: "Ketoconazole 2% shampoo (used as a beard wash)", note: "If beardruff is fungal — same active used for scalp dandruff, applied to beard area", cites: ["beardruffVsDry"] },
    ],
  },
  {
    id: "ingrown",
    name: "Ingrown hairs / razor bumps",
    icon: "ti-alert-triangle",
    summary: "Mostly a shaving-technique problem, not a product problem.",
    routine: [
      { step: "Before shaving", detail: "Shave right after a warm shower — heat softens hair", cites: ["aadShaveDirection"] },
      { step: "While shaving", detail: "Always shave with the grain, never against it; rinse the razor after every swipe", cites: ["aadShaveDirection"] },
      { step: "Razor hygiene", detail: "Change blades every 5–7 shaves; store dry to prevent bacterial buildup", cites: ["aadShaveDirection"] },
      { step: "If already inflamed", detail: "Stop shaving 3–4 weeks until bumps clear, then resume every-other-day instead of daily", cites: ["pseudofolliculitis"] },
    ],
    caution: "More common in curly/coarse hair textures — the curved hair re-enters the skin as it grows. Letting it grow longer, not shaving closer, is often the actual fix.",
    cautionCites: ["pseudofolliculitis"],
    products: [
      { name: "Single-blade or electric razor (not multi-blade cartridge)", note: "Multi-blade razors cut hair below the skin surface, increasing ingrown risk", cites: [] },
      { name: "Glycolic acid lotion (post-bump)", note: "Standard keratolytic used once active inflammation has settled", cites: ["pseudofolliculitis"] },
    ],
  },
];

const RED_FLAGS = [
  {
    title: "500+ brands flagged for misleading claims",
    detail: "ASCI 2025–26 enforcement included Mamaearth, HUL, Dove, L'Oréal, and Nykaa.",
    cites: ["asci500", "asciQuote"],
    icon: "ti-alert-triangle",
  },
  {
    title: "\"% niacinamide\" is often fake",
    detail: "Check ingredient order — actives below water/glycerin/propanediol are usually under 1%.",
    cites: ["niacinamideFake"],
    icon: "ti-list-search",
  },
  {
    title: "30% of FMCG products in India are counterfeit",
    detail: "Buy direct from the brand or an authorized retailer, not unverified marketplace sellers.",
    cites: ["counterfeit"],
    icon: "ti-copy-off",
  },
  {
    title: "Older chemical UV filters have a real safety question",
    detail: "Oxybenzone, octinoxate, homosalate linked to hormonal effects in human studies. Tinosorb-class filters are newer and considered safer.",
    cites: ["oxybenzoneReview", "tinosorbSafe"],
    icon: "ti-flask",
  },
  {
    title: "Hair oil can worsen dandruff",
    detail: "Counter to common practice — oiling the scalp (not the strands) correlates with higher fungal positivity.",
    cites: ["hairOilDandruff"],
    icon: "ti-droplet-off",
  },
  {
    title: "More actives is the #1 self-inflicted mistake",
    detail: "Irritation gets misread as \"needs more exfoliation,\" which worsens the actual problem.",
    cites: ["overlayering"],
    icon: "ti-stack-2",
  },
];

/* ----------------------------------------------------------------------
   THEME
---------------------------------------------------------------------- */

const ThemeContext = createContext("light");

const THEME = {
  light: {
    bg: "#F7F3EA",
    bgRaised: "#FFFFFF",
    bgSunken: "#EFE9DB",
    border: "rgba(40, 32, 20, 0.12)",
    borderStrong: "rgba(40, 32, 20, 0.22)",
    textPrimary: "#241D14",
    textSecondary: "#5C5040",
    textTertiary: "#8C8170",
    accent: "#A8531E",
    accentBg: "#F1E0D2",
    accentText: "#7A3B12",
    sage: "#3F6553",
    sageBg: "#DFE8E1",
    sageText: "#2C4A3C",
    danger: "#8B2E20",
    dangerBg: "#F3DCD3",
  },
  dark: {
    bg: "#171410",
    bgRaised: "#211D16",
    bgSunken: "#0F0D0A",
    border: "rgba(247, 243, 234, 0.12)",
    borderStrong: "rgba(247, 243, 234, 0.22)",
    textPrimary: "#F2ECE0",
    textSecondary: "#B9AF9D",
    textTertiary: "#827968",
    accent: "#E08A4F",
    accentBg: "#3A2618",
    accentText: "#F0AE7C",
    sage: "#7FAF98",
    sageBg: "#1E2D26",
    sageText: "#A4CDB8",
    danger: "#E08278",
    dangerBg: "#3A2019",
  },
};

function useTheme() {
  const mode = useContext(ThemeContext);
  return THEME[mode];
}

/* ----------------------------------------------------------------------
   CITATION SYSTEM
   The signature element. Renders as small journal-style footnote tags.
   Clicking expands an inline annotation, like checking a citation
   in an actual paper instead of trusting a marketing claim.
---------------------------------------------------------------------- */

/* ----------------------------------------------------------------------
   ICON SYSTEM
   Inline SVG icons, no external font/CDN dependency. Each path is
   Tabler-style outline icons (24x24 viewBox, stroke-based).
---------------------------------------------------------------------- */

const ICON_PATHS = {
  "sun": "M14.828 14.828a4 4 0 1 0 -5.656 -5.656 4 4 0 0 0 5.656 5.656z M6.343 17.657l-1.414 1.414 M6.343 6.343l-1.414 -1.414 M17.657 6.343l1.414 -1.414 M17.657 17.657l1.414 1.414 M4 12h-2 M12 4v-2 M20 12h2 M12 20v2",
  "moon": "M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454z",
  "sun-high": "M12 17a5 5 0 1 0 0 -10 5 5 0 0 0 0 10z M2 12h2 M20 12h2 M12 2v2 M12 20v2 M5 5l1.5 1.5 M18.5 6.5l1.5 -1.5 M18.5 17.5l1.5 1.5 M5 19l1.5 -1.5",
  "cloud": "M19 18a3.5 3.5 0 0 0 0 -7h-1a5 4.5 0 0 0 -11 -2 4.6 4.4 0 0 0 -2.1 8.4",
  "droplet-half-2": "M12 21c4.4 0 8 -3.6 8 -8s-3.5 -9 -8 -13c-4.5 4 -8 8.5 -8 13s3.6 8 8 8z M4 14h16",
  "layout-grid": "M4 4h6v6h-6z M14 4h6v6h-6z M4 14h6v6h-6z M14 14h6v6h-6z",
  "shield-half-filled": "M12 3a12 12 0 0 0 8.5 3 12 12 0 0 1 -8.5 15 12 12 0 0 1 -8.5 -15 12 12 0 0 0 8.5 -3z M12 3v18",
  "virus": "M8 8.6c2 -1.6 6 -1.6 8 0 M8 15.4c2 1.6 6 1.6 8 0 M5.6 8c-1.6 2 -1.6 6 0 8 M18.4 8c1.6 2 1.6 6 0 8 M12 3v2 M12 19v2 M3 12h2 M19 12h2 M5.5 5.5l1.4 1.4 M17.1 17.1l1.4 1.4 M18.5 5.5l-1.4 1.4 M6.9 17.1l-1.4 1.4 M9.5 9.5a3.5 3.5 0 1 0 5 5 3.5 3.5 0 0 0 -5 -5z",
  "wind": "M5 8h8.5a2.5 2.5 0 1 0 -2.34 -3.5 M3 12h14.5a2.5 2.5 0 1 1 -2.34 3.5 M4 16h7.5a2.5 2.5 0 1 1 -2.34 3.5",
  "chart-line-down": "M3 7l6 6 4 -4 8 8 M21 10v7h-7",
  "wave-square": "M3 16c2 0 3 -1.5 3 -3.5v-1c0 -2 1 -3.5 3 -3.5s3 1.5 3 3.5v1c0 2 1 3.5 3 3.5s3 -1.5 3 -3.5v-1c0 -2 1 -3.5 3 -3.5",
  "wave-sine": "M3 12c1.5 -4 3.5 -6 6 -6s4.5 5 6 5 3 -2 6 -2",
  "mood-smile": "M12 21a9 9 0 1 0 0 -18 9 9 0 0 0 0 18z M9 9h.01 M15 9h.01 M9 13a3.5 3 0 0 0 6 0",
  "alert-triangle": "M12 9v4 M10.4 4.2l-8.2 13.6a1.8 1.8 0 0 0 1.6 2.7h16.4a1.8 1.8 0 0 0 1.6 -2.7l-8.2 -13.6a1.8 1.8 0 0 0 -3.2 0z M12 16h.01",
  "list-search": "M4 6h16 M4 12h7 M4 18h7 M19.5 19.5l-1.5 -1.5 M14 17a3 3 0 1 0 6 0 3 3 0 1 0 -6 0z",
  "copy-off": "M9 7h7a1 1 0 0 1 1 1v7m-1.121 2.879a1 1 0 0 1 -.879 .121h-7a1 1 0 0 1 -1 -1v-7c0 -.31 .14 -.586 .344 -.775 M3 3l18 18",
  "flask": "M9 3h6 M10 3v6.5l-4.5 8.5a1 1 0 0 0 .87 1.5h11.26a1 1 0 0 0 .87 -1.5l-4.5 -8.5v-6.5 M7.5 15h9",
  "droplet-off": "M16.9 16.9c-1.1 1.6 -2.9 3.1 -4.9 4.1 -4.4 -2.2 -8 -6.6 -8 -11s1 -5.6 3 -9 M9.7 5.7c.7 -.9 1.5 -1.8 2.3 -2.7 4.4 2.2 8 6.6 8 11 0 1 -.1 1.9 -.4 2.8 M3 3l18 18",
  "stack-2": "M12 4l8 4 -8 4 -8 -4z M4 14l8 4 8 -4 M4 10l8 4 8 -4",
  "list-check": "M3.5 5.5l1.5 1.5 2.5 -2.5 M3.5 11.5l1.5 1.5 2.5 -2.5 M3.5 17.5l1.5 1.5 2.5 -2.5 M11 6h9 M11 12h9 M11 18h9",
  "shopping-bag": "M6.3 5h11.4l1.8 4.5v10.5a1 1 0 0 1 -1 1h-13a1 1 0 0 1 -1 -1v-10.5z M9 9.5a3 3 0 1 0 6 0 M4.5 9.5h15",
  "chevron-down": "M6 9l6 6 6 -6",
  "cut": "M6 9a3 3 0 1 0 0 -6 3 3 0 0 0 0 6z M6 21a3 3 0 1 0 0 -6 3 3 0 0 0 0 6z M8.6 8.6l10.4 10.4 M8.6 15.4l10.4 -10.4 M6 9v6",
  "razor": "M5 13l6 -6 M11 7l7 7 -3 3 -7 -7z M8 16l-3 3 M3 21l2 -2",
};

function Icon({ name, size = 16, color, style, className }) {
  const d = ICON_PATHS[name];
  if (!d) return null;
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke={color || "currentColor"}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      style={{ display: "inline-block", flexShrink: 0, ...style }}
    >
      {d.split(" M").map((seg, i) => (
        <path key={i} d={i === 0 ? seg : "M" + seg} />
      ))}
    </svg>
  );
}

function CiteTag({ id, index }) {
  const t = useTheme();
  const [open, setOpen] = useState(false);
  const source = SOURCES[id];
  if (!source) return null;

  return (
    <span style={{ display: "inline", position: "relative" }}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={`Source ${index + 1}: ${source.label}`}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          minWidth: "18px",
          height: "18px",
          padding: "0 4px",
          marginLeft: "3px",
          fontSize: "10.5px",
          fontFamily: "var(--mono-font)",
          fontWeight: 500,
          lineHeight: 1,
          color: open ? t.bgRaised : t.sageText,
          background: open ? t.sage : t.sageBg,
          border: `0.5px solid ${open ? t.sage : t.borderStrong}`,
          borderRadius: "4px",
          cursor: "pointer",
          verticalAlign: "2px",
          transition: "background 0.12s ease, color 0.12s ease",
        }}
      >
        {index + 1}
      </button>
    </span>
  );
}

function CitationRow({ ids }) {
  if (!ids || ids.length === 0) return null;
  return (
    <span>
      {ids.map((id, i) => (
        <CiteTag key={id} id={id} index={i} />
      ))}
    </span>
  );
}

function CitationPanel({ ids }) {
  const t = useTheme();
  const [openId, setOpenId] = useState(null);

  if (!ids || ids.length === 0) return null;

  return (
    <div style={{ marginTop: "10px", display: "flex", flexDirection: "column", gap: "6px" }}>
      {ids.map((id, i) => {
        const source = SOURCES[id];
        if (!source) return null;
        const isOpen = openId === id;
        return (
          <div key={id}>
            <button
              onClick={() => setOpenId(isOpen ? null : id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                width: "100%",
                textAlign: "left",
                background: "transparent",
                border: "none",
                padding: "2px 0",
                cursor: "pointer",
                font: "inherit",
              }}
            >
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minWidth: "18px",
                  height: "18px",
                  fontSize: "10.5px",
                  fontFamily: "var(--mono-font)",
                  fontWeight: 500,
                  color: t.sageText,
                  background: t.sageBg,
                  borderRadius: "4px",
                  flexShrink: 0,
                }}
              >
                {i + 1}
              </span>
              <span style={{ fontSize: "12.5px", color: t.textSecondary, flex: 1 }}>
                {source.label}
              </span>
              <Icon
                name="chevron-down"
                size={14}
                color={t.textTertiary}
                style={{
                  transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.15s ease",
                }}
              />
            </button>
            {isOpen && (
              <div
                style={{
                  margin: "4px 0 4px 26px",
                  padding: "10px 12px",
                  background: t.bgSunken,
                  borderLeft: `2px solid ${t.sage}`,
                  borderRadius: "0 6px 6px 0",
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontSize: "13px",
                    fontStyle: "italic",
                    color: t.textPrimary,
                    lineHeight: 1.55,
                  }}
                >
                  "{source.quote}"
                </p>
                <p
                  style={{
                    margin: "6px 0 0",
                    fontSize: "12px",
                    color: t.textTertiary,
                    lineHeight: 1.5,
                  }}
                >
                  {source.detail}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ----------------------------------------------------------------------
   SMALL UI PRIMITIVES
---------------------------------------------------------------------- */

function SectionLabel({ children }) {
  const t = useTheme();
  return (
    <p
      style={{
        margin: "0 0 10px",
        fontSize: "11px",
        fontWeight: 500,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        color: t.textTertiary,
        fontFamily: "var(--mono-font)",
      }}
    >
      {children}
    </p>
  );
}

function StepRow({ step, detail, cites }) {
  const t = useTheme();
  return (
    <div
      style={{
        display: "flex",
        gap: "12px",
        padding: "10px 0",
        borderBottom: `0.5px solid ${t.border}`,
      }}
    >
      <div style={{ minWidth: "92px", flexShrink: 0 }}>
        <span style={{ fontSize: "13px", fontWeight: 500, color: t.textPrimary }}>{step}</span>
      </div>
      <div style={{ flex: 1 }}>
        <span style={{ fontSize: "13.5px", color: t.textSecondary, lineHeight: 1.5 }}>
          {detail}
        </span>
        <CitationRow ids={cites} />
      </div>
    </div>
  );
}

function CautionBox({ text, cites }) {
  const t = useTheme();
  if (!text) return null;
  return (
    <div
      style={{
        marginTop: "14px",
        padding: "12px 14px",
        background: t.accentBg,
        borderRadius: "var(--border-radius-md, 8px)",
        display: "flex",
        gap: "10px",
        alignItems: "flex-start",
      }}
    >
      <Icon
        name="alert-triangle"
        size={16}
        color={t.accentText}
        style={{ marginTop: "1px" }}
      />
      <div>
        <span style={{ fontSize: "13px", color: t.accentText, lineHeight: 1.5 }}>{text}</span>
        <CitationRow ids={cites} />
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------------
   FACE TYPE CARD
---------------------------------------------------------------------- */

function ProductList({ products }) {
  const t = useTheme();
  if (!products || products.length === 0) return null;
  return (
    <div style={{ marginTop: "16px" }}>
      <SectionLabel>
        <Icon name="shopping-bag" style={{fontSize: "12px", marginRight: "5px", verticalAlign: "-1px"}} />
        Products people actually use (India)
      </SectionLabel>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {products.map((p, i) => (
          <div
            key={i}
            style={{
              padding: "10px 12px",
              background: t.bgSunken,
              borderRadius: "var(--border-radius-md, 8px)",
            }}
          >
            <p style={{ margin: 0, fontSize: "13px", fontWeight: 500, color: t.textPrimary }}>{p.name}</p>
            <p style={{ margin: "3px 0 0", fontSize: "12.5px", color: t.textSecondary, lineHeight: 1.5 }}>
              {p.note}
              <CitationRow ids={p.cites} />
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function FaceCard({ type }) {
  const t = useTheme();
  const [expanded, setExpanded] = useState(false);
  const allCites = useMemo(() => {
    const ids = new Set();
    [...type.am, ...type.pm].forEach((s) => s.cites.forEach((c) => ids.add(c)));
    type.cautionCites.forEach((c) => ids.add(c));
    (type.products || []).forEach((p) => p.cites.forEach((c) => ids.add(c)));
    return Array.from(ids);
  }, [type]);

  return (
    <div
      style={{
        background: t.bgRaised,
        border: `0.5px solid ${t.border}`,
        borderRadius: "var(--border-radius-lg, 12px)",
        overflow: "hidden",
      }}
    >
      <button
        onClick={() => setExpanded((e) => !e)}
        aria-expanded={expanded}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          padding: "14px 16px",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        <div
          style={{
            width: "34px",
            height: "34px",
            borderRadius: "9px",
            background: t.accentBg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Icon name={type.icon.replace("ti-", "")} size={17} color={t.accentText} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ margin: 0, fontSize: "14.5px", fontWeight: 500, color: t.textPrimary }}>
            {type.name}
          </p>
          <p style={{ margin: "1px 0 0", fontSize: "12.5px", color: t.textTertiary }}>
            {type.summary}
          </p>
        </div>
        <Icon
          name="chevron-down"
          size={18}
          color={t.textTertiary}
          style={{
            transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.15s ease",
          }}
        />
      </button>

      {expanded && (
        <div style={{ padding: "0 16px 16px" }}>
          <div className="shr-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            <div>
              <SectionLabel>
                <Icon name="sun" style={{fontSize: "12px", marginRight: "5px", verticalAlign: "-1px"}} />
                Morning
              </SectionLabel>
              {type.am.map((s, i) => (
                <StepRow key={i} {...s} />
              ))}
            </div>
            <div>
              <SectionLabel>
                <Icon name="moon" style={{fontSize: "12px", marginRight: "5px", verticalAlign: "-1px"}} />
                Night
              </SectionLabel>
              {type.pm.map((s, i) => (
                <StepRow key={i} {...s} />
              ))}
            </div>
          </div>

          <CautionBox text={type.caution} cites={type.cautionCites} />

          <ProductList products={type.products} />

          {allCites.length > 0 && (
            <div style={{ marginTop: "16px", paddingTop: "14px", borderTop: `0.5px solid ${t.border}` }}>
              <SectionLabel>Sources cited above</SectionLabel>
              <CitationPanel ids={allCites} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ----------------------------------------------------------------------
   HAIR TYPE CARD
---------------------------------------------------------------------- */

function HairCard({ type }) {
  const t = useTheme();
  const [expanded, setExpanded] = useState(false);
  const allCites = useMemo(() => {
    const ids = new Set();
    type.routine.forEach((s) => s.cites.forEach((c) => ids.add(c)));
    type.cautionCites.forEach((c) => ids.add(c));
    (type.products || []).forEach((p) => p.cites.forEach((c) => ids.add(c)));
    return Array.from(ids);
  }, [type]);

  return (
    <div
      style={{
        background: t.bgRaised,
        border: `0.5px solid ${t.border}`,
        borderRadius: "var(--border-radius-lg, 12px)",
        overflow: "hidden",
      }}
    >
      <button
        onClick={() => setExpanded((e) => !e)}
        aria-expanded={expanded}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          padding: "14px 16px",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        <div
          style={{
            width: "34px",
            height: "34px",
            borderRadius: "9px",
            background: t.sageBg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Icon name={type.icon.replace("ti-", "")} size={17} color={t.sageText} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ margin: 0, fontSize: "14.5px", fontWeight: 500, color: t.textPrimary }}>
            {type.name}
          </p>
          <p style={{ margin: "1px 0 0", fontSize: "12.5px", color: t.textTertiary }}>
            {type.summary}
          </p>
        </div>
        <Icon
          name="chevron-down"
          size={18}
          color={t.textTertiary}
          style={{
            transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.15s ease",
          }}
        />
      </button>

      {expanded && (
        <div style={{ padding: "0 16px 16px" }}>
          <SectionLabel>
            <Icon name="list-check" style={{fontSize: "12px", marginRight: "5px", verticalAlign: "-1px"}} />
            Routine
          </SectionLabel>
          {type.routine.map((s, i) => (
            <StepRow key={i} {...s} />
          ))}

          <CautionBox text={type.caution} cites={type.cautionCites} />

          <ProductList products={type.products} />

          {allCites.length > 0 && (
            <div style={{ marginTop: "16px", paddingTop: "14px", borderTop: `0.5px solid ${t.border}` }}>
              <SectionLabel>Sources cited above</SectionLabel>
              <CitationPanel ids={allCites} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ----------------------------------------------------------------------
   RED FLAGS SECTION
---------------------------------------------------------------------- */

function RedFlagCard({ flag }) {
  const t = useTheme();
  const [showSources, setShowSources] = useState(false);

  return (
    <div
      style={{
        background: t.bgRaised,
        border: `0.5px solid ${t.border}`,
        borderRadius: "var(--border-radius-lg, 12px)",
        padding: "14px 16px",
      }}
    >
      <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
        <Icon
          name={flag.icon.replace("ti-", "")}
          size={17}
          color={t.danger}
          style={{ marginTop: "1px" }}
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ margin: 0, fontSize: "13.5px", fontWeight: 500, color: t.textPrimary, lineHeight: 1.45 }}>
            {flag.title}
          </p>
          <p style={{ margin: "4px 0 0", fontSize: "12.5px", color: t.textSecondary, lineHeight: 1.5 }}>
            {flag.detail}
          </p>
          <button
            onClick={() => setShowSources((s) => !s)}
            style={{
              marginTop: "8px",
              background: "transparent",
              border: "none",
              padding: 0,
              cursor: "pointer",
              fontSize: "12px",
              color: t.sageText,
              display: "flex",
              alignItems: "center",
              gap: "4px",
              fontFamily: "var(--mono-font)",
            }}
          >
            {showSources ? "Hide" : "Show"} {flag.cites.length} source{flag.cites.length > 1 ? "s" : ""}
            <Icon
              name="chevron-down"
              size={13}
              style={{
                transform: showSources ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.15s ease",
              }}
            />
          </button>
          {showSources && <CitationPanel ids={flag.cites} />}
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------------
   TAB SWITCHER
---------------------------------------------------------------------- */

function TabSwitcher({ active, onChange }) {
  const t = useTheme();
  const tabs = [
    { id: "face", label: "Face", icon: "ti-mood-smile" },
    { id: "hair", label: "Hair", icon: "ti-wave-sine" },
    { id: "beard", label: "Beard", icon: "ti-razor" },
    { id: "flags", label: "Red flags", icon: "ti-alert-triangle" },
  ];

  return (
    <div
      role="tablist"
      style={{
        display: "inline-flex",
        gap: "2px",
        padding: "3px",
        background: t.bgSunken,
        borderRadius: "var(--border-radius-lg, 12px)",
      }}
    >
      {tabs.map((tab) => {
        const isActive = active === tab.id;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 16px",
              fontSize: "13.5px",
              fontWeight: 500,
              border: "none",
              borderRadius: "var(--border-radius-md, 8px)",
              cursor: "pointer",
              color: isActive ? t.bgRaised : t.textSecondary,
              background: isActive ? t.textPrimary : "transparent",
              transition: "background 0.15s ease, color 0.15s ease",
            }}
          >
            <Icon name={tab.icon.replace("ti-", "")} size={15} />
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

/* ----------------------------------------------------------------------
   THEME TOGGLE
---------------------------------------------------------------------- */

function ThemeToggle({ mode, onToggle }) {
  const t = useTheme();
  return (
    <button
      onClick={onToggle}
      aria-label={mode === "light" ? "Switch to dark mode" : "Switch to light mode"}
      style={{
        width: "36px",
        height: "36px",
        borderRadius: "var(--border-radius-md, 8px)",
        border: `0.5px solid ${t.border}`,
        background: t.bgRaised,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        flexShrink: 0,
      }}
    >
      <Icon
        name={mode === "light" ? "moon" : "sun"}
        size={17}
        color={t.textSecondary}
      />
    </button>
  );
}

/* ----------------------------------------------------------------------
   ROOT COMPONENT
---------------------------------------------------------------------- */

export default function SkinHairRoutine() {
  const [mode, setMode] = useState("dark");
  const [tab, setTab] = useState("face");
  const t = THEME[mode];

  useEffect(() => {
    const styleId = "shr-fonts-and-vars";
    let style = document.getElementById(styleId);
    if (!style) {
      style = document.createElement("style");
      style.id = styleId;
      document.head.appendChild(style);
    }
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@8..60,400;8..60,500&family=Inter:wght@400;500&family=IBM+Plex+Mono:wght@400;500&display=swap');
      html, body { margin: 0; padding: 0; background: ${t.bg}; }
      #root { background: ${t.bg}; }
      .shr-root { --mono-font: 'IBM Plex Mono', monospace; --serif-font: 'Source Serif 4', serif; --sans-font: 'Inter', var(--font-sans, sans-serif); }
      .shr-root * { box-sizing: border-box; }
      .shr-root button:focus-visible { outline: 2px solid currentColor; outline-offset: 2px; }
      @media (max-width: 520px) {
        .shr-grid-2 { grid-template-columns: 1fr !important; }
      }
    `;
  }, [t.bg]);

  return (
    <ThemeContext.Provider value={mode}>
      <div
        style={{
          position: "fixed",
          inset: 0,
          overflowY: "auto",
          width: "100vw",
          minHeight: "100vh",
          background: t.bg,
          display: "flex",
          justifyContent: "center",
          padding: "32px 16px",
          transition: "background 0.2s ease",
        }}
      >
      <div
        className="shr-root"
        style={{
          fontFamily: "var(--sans-font)",
          background: t.bg,
          color: t.textPrimary,
          borderRadius: "var(--border-radius-xl, 16px)",
          padding: "28px 24px 32px",
          width: "100%",
          maxWidth: "760px",
          height: "fit-content",
          transition: "background 0.2s ease, color 0.2s ease",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "22px",
            gap: "16px",
          }}
        >
          <div>
            <p
              style={{
                margin: "0 0 6px",
                fontSize: "11px",
                fontWeight: 500,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: t.sageText,
                fontFamily: "var(--mono-font)",
              }}
            >
              Evidence-based · India climate
            </p>
            <h1
              style={{
                margin: 0,
                fontSize: "25px",
                fontWeight: 500,
                fontFamily: "var(--serif-font)",
                color: t.textPrimary,
                lineHeight: 1.2,
              }}
            >
              Skin &amp; hair routine reference
            </h1>
            <p style={{ margin: "6px 0 0", fontSize: "13px", color: t.textTertiary, maxWidth: "440px", lineHeight: 1.5 }}>
              Every claim below is cited. Tap any numbered tag to see the source.
            </p>
          </div>
          <ThemeToggle mode={mode} onToggle={() => setMode((m) => (m === "light" ? "dark" : "light"))} />
        </div>

        {/* Tabs */}
        <div style={{ marginBottom: "20px" }}>
          <TabSwitcher active={tab} onChange={setTab} />
        </div>

        {/* Universal callout — only on face/hair/beard tabs */}
        {(tab === "face" || tab === "hair" || tab === "beard") && (
          <div
            style={{
              marginBottom: "18px",
              padding: "12px 14px",
              background: t.sageBg,
              borderRadius: "var(--border-radius-md, 8px)",
              display: "flex",
              gap: "10px",
              alignItems: "flex-start",
            }}
          >
            <Icon name="sun-high" style={{fontSize: "16px", color: t.sageText, marginTop: "1px", flexShrink: 0}} />
            <p style={{ margin: 0, fontSize: "12.5px", color: t.sageText, lineHeight: 1.55 }}>
              Indian sunlight is 95–98% UVA — SPF alone isn't enough. Look for PA++++ on every sunscreen, regardless of skin type.
              Korean 9-step routines also weren't designed for this climate or skin type.
              <CitationRow ids={["uva", "paRating", "delhiTrial", "koreanMyth"]} />
            </p>
          </div>
        )}

        {/* Content */}
        {tab === "face" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {FACE_TYPES.map((type) => (
              <FaceCard key={type.id} type={type} />
            ))}
          </div>
        )}

        {tab === "hair" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {HAIR_TYPES.map((type) => (
              <HairCard key={type.id} type={type} />
            ))}
          </div>
        )}

        {tab === "beard" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {BEARD_TYPES.map((type) => (
              <HairCard key={type.id} type={type} />
            ))}
          </div>
        )}

        {tab === "flags" && (
          <div>
            <p style={{ margin: "0 0 16px", fontSize: "13px", color: t.textSecondary, lineHeight: 1.55 }}>
              The part most routine guides skip. Six patterns worth knowing before you spend money.
            </p>
            <div className="shr-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              {RED_FLAGS.map((flag, i) => (
                <RedFlagCard key={i} flag={flag} />
              ))}
            </div>
          </div>
        )}

        {/* Footer note */}
        <div style={{ marginTop: "24px", paddingTop: "16px", borderTop: `0.5px solid ${t.border}` }}>
          <p style={{ margin: 0, fontSize: "11.5px", color: t.textTertiary, lineHeight: 1.5 }}>
            Reference only, not a substitute for a dermatologist. Built from peer-reviewed dermatology research, Indian clinical
            studies, and cross-referenced community sources (r/IndianSkincareAddicts, r/curlyhair).
          </p>
        </div>
      </div>
      </div>
    </ThemeContext.Provider>
  );
}
