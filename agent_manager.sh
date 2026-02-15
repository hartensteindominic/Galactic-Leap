#!/usr/bin/env bash
set -euo pipefail

APP_DIR="${APP_DIR:-$HOME/ai-review-analyzer}"
VENV_DIR="${VENV_DIR:-$HOME/ai-agent-env}"
APP_FILE="${APP_FILE:-app.py}"
PID_PATTERN="python3 ${APP_FILE}"

usage() {
  cat <<USAGE
Usage: $0 <start|stop|restart|status|logs|edit>

Environment overrides:
  APP_DIR   Directory containing your agent project (default: $HOME/ai-review-analyzer)
  VENV_DIR  Python virtual environment directory (default: $HOME/ai-agent-env)
  APP_FILE  Entry-point file (default: app.py)
USAGE
}

ensure_paths() {
  if [[ ! -d "$APP_DIR" ]]; then
    echo "[ERROR] APP_DIR does not exist: $APP_DIR" >&2
    exit 1
  fi

  if [[ ! -f "$APP_DIR/$APP_FILE" ]]; then
    echo "[ERROR] App file not found: $APP_DIR/$APP_FILE" >&2
    exit 1
  fi

  if [[ ! -f "$VENV_DIR/bin/activate" ]]; then
    echo "[ERROR] Virtual environment activate script not found: $VENV_DIR/bin/activate" >&2
    exit 1
  fi
}

stop_agent() {
  if pgrep -f "$PID_PATTERN" >/dev/null; then
    pkill -f "$PID_PATTERN"
    echo "[OK] Stopped running agent process(es): $PID_PATTERN"
  else
    echo "[OK] No running process matched: $PID_PATTERN"
  fi
}

start_agent() {
  ensure_paths
  cd "$APP_DIR"
  # shellcheck disable=SC1090
  source "$VENV_DIR/bin/activate"
  nohup python3 "$APP_FILE" > agent.log 2>&1 &
  sleep 1
  if pgrep -f "$PID_PATTERN" >/dev/null; then
    echo "[OK] Agent started. Logs: $APP_DIR/agent.log"
  else
    echo "[ERROR] Agent failed to start. Check log: $APP_DIR/agent.log" >&2
    exit 1
  fi
}

status_agent() {
  if pgrep -af "$PID_PATTERN" >/dev/null; then
    echo "[OK] Agent is running:"
    pgrep -af "$PID_PATTERN"
  else
    echo "[OK] Agent is not running"
  fi
}

logs_agent() {
  ensure_paths
  touch "$APP_DIR/agent.log"
  tail -n 50 -f "$APP_DIR/agent.log"
}

edit_app() {
  ensure_paths
  local editor="${EDITOR:-nano}"
  "$editor" "$APP_DIR/$APP_FILE"
}

main() {
  case "${1:-}" in
    start)
      start_agent
      ;;
    stop)
      stop_agent
      ;;
    restart)
      stop_agent
      start_agent
      ;;
    status)
      status_agent
      ;;
    logs)
      logs_agent
      ;;
    edit)
      edit_app
      ;;
    *)
      usage
      exit 1
      ;;
  esac
}

main "$@"
