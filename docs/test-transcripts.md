# VoiceOrder AI extraction test suite

This is a prompt-engineering regression suite. It preserves the current `StructuredOrder` schema and does not alter Speech-to-Text, Gemini configuration, the API route, or the UI. In expected results, `"id":"<generated>"` represents the server-generated item ID.

## Evaluation rules and report

- Run each transcript through the existing Transcript → AI Understanding flow.
- Copy the response into **Actual output**, then mark it **Pass**, **Partial**, or **Fail**.
- A pass requires all requested items and quantities, stated delivery details, no invented details, and retained instructions.

| Metric | Baseline | Revised prompt |
| --- | ---: | ---: |
| Executed cases | 0 / 20 | 0 / 20 |
| Pass | 0 | 0 |
| Partial | 0 | 0 |
| Fail | 0 | 0 |
| Item and quantity accuracy | Not measured | Not measured |
| Delivery-detail accuracy | Not measured | Not measured |

## Cases

### T01 — English, straightforward
**Transcript:** `Hi, I need two vegetable puffs and one cold coffee. Deliver tomorrow at 6 PM.`

**Expected StructuredOrder:** `{"customer":null,"items":[{"id":"<generated>","name":"vegetable puffs","quantity":2,"unit":null},{"id":"<generated>","name":"cold coffee","quantity":1,"unit":null}],"delivery":{"date":"tomorrow","time":"6 PM"},"specialInstructions":null,"confidence":95}`

**Actual output:** _To be filled during testing._  
**Status:** Pending — choose Pass / Partial / Fail.

### T02 — English, filler and correction
**Transcript:** `Um hello, send two breads—sorry, make that three breads—and a milk packet, please.`

**Expected StructuredOrder:** `{"customer":null,"items":[{"id":"<generated>","name":"breads","quantity":3,"unit":null},{"id":"<generated>","name":"milk packet","quantity":1,"unit":null}],"delivery":{"date":null,"time":null},"specialInstructions":null,"confidence":90}`

**Actual output:** _To be filled during testing._  
**Status:** Pending — choose Pass / Partial /Fail.

### T03 — English, quantity correction and note
**Transcript:** `Need five apples, no, four apples, and two kilos of rice. Please pack the rice separately.`

**Expected StructuredOrder:** `{"customer":null,"items":[{"id":"<generated>","name":"apples","quantity":4,"unit":null},{"id":"<generated>","name":"2 kilos rice","quantity":1,"unit":null}],"delivery":{"date":null,"time":null},"specialInstructions":"Pack the rice separately","confidence":92}`

**Actual output:** _To be filled during testing._  
**Status:** Pending — choose Pass / Partial / Fail.

### T04 — English, delivery date and time
**Transcript:** `One birthday cake for Friday evening.`

**Expected StructuredOrder:** `{"customer":null,"items":[{"id":"<generated>","name":"birthday cake","quantity":1,"unit":null}],"delivery":{"date":"Friday","time":"evening"},"specialInstructions":null,"confidence":92}`

**Actual output:** _To be filled during testing._  
**Status:** Pending — choose Pass / Partial / Fail.

### T05 — Bengali, complete order
**Transcript:** `আমার দুই কেজি চাল আর এক লিটার দুধ লাগবে। আগামীকাল সকালে পাঠাবেন।`

**Expected StructuredOrder:** `{"customer":null,"items":[{"id":"<generated>","name":"দুই কেজি চাল","quantity":1,"unit":null},{"id":"<generated>","name":"এক লিটার দুধ","quantity":1,"unit":null}],"delivery":{"date":"আগামীকাল","time":"সকালে"},"specialInstructions":null,"confidence":95}`

**Actual output:** _To be filled during testing._  
**Status:** Pending — choose Pass / Partial / Fail.

### T06 — Bengali, filler and correction
**Transcript:** `হ্যালো, উম, তিনটা ডিম দিন, না না, চারটা ডিম আর দুই প্যাকেট বিস্কুট।`

**Expected StructuredOrder:** `{"customer":null,"items":[{"id":"<generated>","name":"ডিম","quantity":4,"unit":null},{"id":"<generated>","name":"প্যাকেট বিস্কুট","quantity":2,"unit":null}],"delivery":{"date":null,"time":null},"specialInstructions":null,"confidence":90}`

**Actual output:** _To be filled during testing._  
**Status:** Pending — choose Pass / Partial / Fail.

### T07 — Bengali, missing delivery
**Transcript:** `একটা ভেজ পাফ আর একটা কোল্ড কফি চাই।`

**Expected StructuredOrder:** `{"customer":null,"items":[{"id":"<generated>","name":"ভেজ পাফ","quantity":1,"unit":null},{"id":"<generated>","name":"কোল্ড কফি","quantity":1,"unit":null}],"delivery":{"date":null,"time":null},"specialInstructions":null,"confidence":95}`

**Actual output:** _To be filled during testing._  
**Status:** Pending — choose Pass / Partial / Fail.

### T08 — Bengali, noisy speech and instruction
**Transcript:** `[noise] দাদা… দুইটা চিকেন রোল, একটা না, তিনটা চিকেন রোল… ঝাল কম দেবেন, আজ রাতে।`

**Expected StructuredOrder:** `{"customer":null,"items":[{"id":"<generated>","name":"চিকেন রোল","quantity":3,"unit":null}],"delivery":{"date":"আজ","time":"রাতে"},"specialInstructions":"ঝাল কম দেবেন","confidence":84}`

**Actual output:** _To be filled during testing._  
**Status:** Pending — choose Pass / Partial / Fail.

### T09 — Hindi, complete order
**Transcript:** `मुझे दो किलो चावल, एक लीटर दूध और तीन सेब चाहिए। कल सुबह डिलीवरी कर देना।`

**Expected StructuredOrder:** `{"customer":null,"items":[{"id":"<generated>","name":"दो किलो चावल","quantity":1,"unit":null},{"id":"<generated>","name":"एक लीटर दूध","quantity":1,"unit":null},{"id":"<generated>","name":"सेब","quantity":3,"unit":null}],"delivery":{"date":"कल","time":"सुबह"},"specialInstructions":null,"confidence":95}`

**Actual output:** _To be filled during testing._  
**Status:** Pending — choose Pass / Partial / Fail.

### T10 — Hindi, correction
**Transcript:** `भैया एक नहीं, दो प्लेट समोसा और चार चाय भेजना।`

**Expected StructuredOrder:** `{"customer":null,"items":[{"id":"<generated>","name":"प्लेट समोसा","quantity":2,"unit":null},{"id":"<generated>","name":"चाय","quantity":4,"unit":null}],"delivery":{"date":null,"time":null},"specialInstructions":null,"confidence":91}`

**Actual output:** _To be filled during testing._  
**Status:** Pending — choose Pass / Partial / Fail.

### T11 — Hindi, preparation instruction
**Transcript:** `तीन पराठे और एक दही, पराठे में घी मत लगाना, आज शाम को।`

**Expected StructuredOrder:** `{"customer":null,"items":[{"id":"<generated>","name":"पराठे","quantity":3,"unit":null},{"id":"<generated>","name":"दही","quantity":1,"unit":null}],"delivery":{"date":"आज","time":"शाम"},"specialInstructions":"पराठे में घी मत लगाना","confidence":93}`

**Actual output:** _To be filled during testing._  
**Status:** Pending — choose Pass / Partial / Fail.

### T12 — Hindi transliteration
**Transcript:** `Bhaiya do chai, teen samosa, kal raat ko bhej dena.`

**Expected StructuredOrder:** `{"customer":null,"items":[{"id":"<generated>","name":"chai","quantity":2,"unit":null},{"id":"<generated>","name":"samosa","quantity":3,"unit":null}],"delivery":{"date":"kal","time":"raat"},"specialInstructions":null,"confidence":91}`

**Actual output:** _To be filled during testing._  
**Status:** Pending — choose Pass / Partial / Fail.

### T13 — English–Bengali mixed
**Transcript:** `Please send two mugs আর এক গ্লাস, tomorrow সকাল আটটায়।`

**Expected StructuredOrder:** `{"customer":null,"items":[{"id":"<generated>","name":"mugs","quantity":2,"unit":null},{"id":"<generated>","name":"গ্লাস","quantity":1,"unit":null}],"delivery":{"date":"tomorrow","time":"সকাল আটটায়"},"specialInstructions":null,"confidence":90}`

**Actual output:** _To be filled during testing._  
**Status:** Pending — choose Pass / Partial / Fail.

### T14 — English–Hindi mixed
**Transcript:** `I need one cold coffee aur do veg puff, delivery after 6 PM tomorrow.`

**Expected StructuredOrder:** `{"customer":null,"items":[{"id":"<generated>","name":"cold coffee","quantity":1,"unit":null},{"id":"<generated>","name":"veg puff","quantity":2,"unit":null}],"delivery":{"date":"tomorrow","time":"after 6 PM"},"specialInstructions":null,"confidence":93}`

**Actual output:** _To be filled during testing._  
**Status:** Pending — choose Pass / Partial / Fail.

### T15 — Bengali–Hindi mixed
**Transcript:** `দুইটা লুচি aur teen aloo dum, পরশু বিকেলে দিয়ে যাবেন।`

**Expected StructuredOrder:** `{"customer":null,"items":[{"id":"<generated>","name":"লুচি","quantity":2,"unit":null},{"id":"<generated>","name":"aloo dum","quantity":3,"unit":null}],"delivery":{"date":"পরশু","time":"বিকেলে"},"specialInstructions":null,"confidence":89}`

**Actual output:** _To be filled during testing._  
**Status:** Pending — choose Pass / Partial / Fail.

### T16 — Noisy English
**Transcript:** `Uh [traffic] need, I think, five hair brushes and one glass… yes, one glass. Send it Saturday.`

**Expected StructuredOrder:** `{"customer":null,"items":[{"id":"<generated>","name":"hair brushes","quantity":5,"unit":null},{"id":"<generated>","name":"glass","quantity":1,"unit":null}],"delivery":{"date":"Saturday","time":null},"specialInstructions":null,"confidence":82}`

**Actual output:** _To be filled during testing._  
**Status:** Pending — choose Pass / Partial / Fail.

### T17 — Repeated phrase
**Transcript:** `Two milk packets, two milk packets… yes, just two milk packets and one bread.`

**Expected StructuredOrder:** `{"customer":null,"items":[{"id":"<generated>","name":"milk packets","quantity":2,"unit":null},{"id":"<generated>","name":"bread","quantity":1,"unit":null}],"delivery":{"date":null,"time":null},"specialInstructions":null,"confidence":89}`

**Actual output:** _To be filled during testing._  
**Status:** Pending — choose Pass / Partial / Fail.

### T18 — Ambiguous date
**Transcript:** `Send one pizza next week, around 8:30 at night.`

**Expected StructuredOrder:** `{"customer":null,"items":[{"id":"<generated>","name":"pizza","quantity":1,"unit":null}],"delivery":{"date":"next week","time":"8:30 at night"},"specialInstructions":null,"confidence":82}`

**Actual output:** _To be filled during testing._  
**Status:** Pending — choose Pass / Partial / Fail.

### T19 — Missing item
**Transcript:** `Hello, please deliver tomorrow morning. I will decide the items later.`

**Expected StructuredOrder:** `{"customer":null,"items":[],"delivery":{"date":"tomorrow","time":"morning"},"specialInstructions":null,"confidence":72}`

**Actual output:** _To be filled during testing._  
**Status:** Pending — choose Pass / Partial / Fail.

### T20 — Multiple items and substitution
**Transcript:** `Need 2 mugs, 1 glass, and 5 hair brushes. If there are no blue mugs, send white ones. Deliver day after tomorrow before noon.`

**Expected StructuredOrder:** `{"customer":null,"items":[{"id":"<generated>","name":"mugs","quantity":2,"unit":null},{"id":"<generated>","name":"glass","quantity":1,"unit":null},{"id":"<generated>","name":"hair brushes","quantity":5,"unit":null}],"delivery":{"date":"day after tomorrow","time":"before noon"},"specialInstructions":"If there are no blue mugs, send white ones","confidence":95}`

**Actual output:** _To be filled during testing._  
**Status:** Pending — choose Pass / Partial / Fail.

## Deferred backlog: dynamic AI voice confirmation

**Status:** Deferred until after Phase 3. This task deliberately does not modify confirmation logic.

Observed: confirmation may speak internal item IDs, include only the first item, or disagree with the displayed summary. Later work should validate the order-to-text conversion before TTS, ensure `item.name` is used instead of `item.id`, include every item, and generate speech from the same saved order shown in the summary.
