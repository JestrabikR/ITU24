UNAME_S := $(shell uname -s)

PYTHON_VENV := .venv\\Scripts\\activate

ifeq ($(UNAME_S), Linux)
	PYTHON_VENV := . .venv/bin/activate
endif

run:
	cd ./api && python -m venv .venv && $(PYTHON_VENV) && pip install -r requirements.txt && python main.py

svelte: # doesn't work on windows
	cd ./svelte && npm install && npm run dev

.PHONY: svelte
