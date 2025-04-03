// services/WebSocketService.js
class WebSocketService {
    constructor() {
      this.socket = null;
      this.url = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3000/api/ws';
      this.listeners = new Map();
      this.reconnectAttempts = 0;
      this.maxReconnectAttempts = 5;
      this.reconnectInterval = 5000;
      this.authToken = null;
    }
  
    connect() {
      if (this.socket && (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING)) {
        console.log('WebSocket is already connected or connecting');
        return;
      }
  
      this.authToken = localStorage.getItem("token");
      const wsUrl = this.authToken ? `${this.url}?token=${this.authToken}` : this.url;
  
      try {
        console.log('Connecting to WebSocket:', wsUrl);
        this.socket = new WebSocket(wsUrl);
  
        this.socket.onopen = () => {
          console.log('WebSocket connected');
          this.reconnectAttempts = 0;
          this.emit('open', null);
        };
  
        this.socket.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            console.log('WebSocket message received:', data);
            
            // If the message has a type, emit that specific event
            if (data.type) {
              this.emit(data.type, data.payload || data);
            }
            
            // Always emit the generic 'message' event
            this.emit('message', data);
          } catch (err) {
            console.error('Error parsing WebSocket message:', err);
            this.emit('error', err);
          }
        };
  
        this.socket.onerror = (event) => {
          console.error('WebSocket error:', event);
          this.emit('error', new Error('WebSocket connection error'));
        };
  
        this.socket.onclose = (event) => {
          console.log('WebSocket connection closed:', event);
          this.emit('close', event);
  
          // Attempt to reconnect if the connection was closed unexpectedly
          if (event.code !== 1000 && this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts}) in ${this.reconnectInterval}ms`);
            
            setTimeout(() => {
              this.connect();
            }, this.reconnectInterval);
          }
        };
      } catch (err) {
        console.error('Failed to create WebSocket connection:', err);
        this.emit('error', err);
      }
    }
  
    disconnect() {
      if (this.socket) {
        this.socket.close(1000, 'User initiated disconnect');
        this.socket = null;
      }
    }
  
    on(event, callback) {
      if (!this.listeners.has(event)) {
        this.listeners.set(event, []);
      }
      this.listeners.get(event).push(callback);
      return () => this.off(event, callback);
    }
  
    off(event, callback) {
      if (!this.listeners.has(event)) {
        return;
      }
      const callbacks = this.listeners.get(event);
      const index = callbacks.indexOf(callback);
      if (index !== -1) {
        callbacks.splice(index, 1);
      }
    }
  
    emit(event, data) {
      if (this.listeners.has(event)) {
        const callbacks = this.listeners.get(event);
        callbacks.forEach(callback => {
          try {
            callback(data);
          } catch (err) {
            console.error(`Error in ${event} listener:`, err);
          }
        });
      }
    }
  
    sendMessage(message) {
      if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
        console.error('Cannot send message: WebSocket is not connected');
        return false;
      }
  
      try {
        const data = typeof message === 'string' ? message : JSON.stringify(message);
        this.socket.send(data);
        return true;
      } catch (err) {
        console.error('Error sending message:', err);
        return false;
      }
    }
  
    // Subscribe to specific resource updates
    subscribeToAlmacen(almacenId) {
      return this.sendMessage({
        action: 'subscribe',
        resource: 'almacen',
        id: almacenId
      });
    }
  
    subscribeToProducto(productoId) {
      return this.sendMessage({
        action: 'subscribe',
        resource: 'producto',
        id: productoId
      });
    }
  
    subscribeToMovimientos() {
      return this.sendMessage({
        action: 'subscribe',
        resource: 'movimientos'
      });
    }

    subscribeToMovimiento(movimientoId) {
      return this.sendMessage({
        action: 'subscribe',
        resource: 'movimiento',
        id: movimientoId
      });
    }
}