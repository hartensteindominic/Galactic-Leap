# Galactic-Leap Linux Agent Helper

This repo provides a small Linux utility script to manage a Python-based AI agent service.

## Why your command failed

You ran:

```bash
nano.app.py
```

That is treated as a single command name and fails.

Use one of these instead:

```bash
nano app.py
# or
python3 app.py
```

## Quick start

```bash
chmod +x agent_manager.sh
./agent_manager.sh start
./agent_manager.sh status
./agent_manager.sh logs
./agent_manager.sh edit
./agent_manager.sh restart
./agent_manager.sh stop
```

## Defaults used by the script

- `APP_DIR=$HOME/ai-review-analyzer`
- `VENV_DIR=$HOME/ai-agent-env`
- `APP_FILE=app.py`

You can override them:

```bash
APP_DIR=~/my-agent VENV_DIR=~/venvs/agent APP_FILE=main.py ./agent_manager.sh restart
```
