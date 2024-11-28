// Временные данные для тестирования
export const MOCK_CLIENTS = [
  {
    id: 1,
    name: "Анна Смирнова",
    phone: "+7 (777) 123-45-67",
    contacts: {
      whatsapp: "+7 (777) 123-45-67",
      instagram: "@anna_smirnova",
      address: "ул. Абая 123, кв. 45"
    },
    tags: ["VIP", "Любит розы"],
    totalOrders: 15,
    totalSpent: 450000,
    lastOrder: "2024-01-15",
    joinDate: "2023-01-15",
    preferences: {
      favoriteFlowers: ["Розы", "Пионы"],
      allergies: ["Лилии"],
      preferredColors: ["Розовый", "Белый"],
      preferredDeliveryTime: "Утро"
    },
    notes: [
      {
        id: 1,
        text: "Предпочитает классические букеты",
        date: "2024-01-15",
        author: "Менеджер Алия"
      }
    ],
    importantDates: [
      {
        id: 1,
        occasion: "День рождения",
        date: "1990-05-15"
      }
    ]
  },
  {
    id: 2,
    name: "Мария Петрова",
    phone: "+7 (777) 234-56-78",
    contacts: {
      whatsapp: "+7 (777) 234-56-78",
      instagram: "@maria_flowers",
      address: "ул. Достык 78, кв. 12"
    },
    tags: ["Новый клиент", "Предпочитает доставку"],
    totalOrders: 3,
    totalSpent: 75000,
    lastOrder: "2024-01-10",
    joinDate: "2023-12-01",
    preferences: {
      favoriteFlowers: ["Орхидеи"],
      allergies: [],
      preferredColors: ["Фиолетовый"],
      preferredDeliveryTime: "Вечер"
    },
    notes: [],
    importantDates: []
  },
  {
    id: 3,
    name: "Алексей Иванов",
    phone: "+7 (777) 345-67-89",
    contacts: {
      whatsapp: "+7 (777) 345-67-89",
      instagram: "@alex_i",
      address: "пр. Аль-Фараби 100"
    },
    tags: ["Корпоративный", "Большие заказы"],
    totalOrders: 8,
    totalSpent: 320000,
    lastOrder: "2024-01-08",
    joinDate: "2023-06-15",
    preferences: {
      favoriteFlowers: ["Розы", "Лилии"],
      allergies: [],
      preferredColors: ["Красный", "Белый"],
      preferredDeliveryTime: "Утро"
    },
    notes: [
      {
        id: 1,
        text: "Часто заказывает для офиса",
        date: "2023-12-20",
        author: "Менеджер Дина"
      }
    ],
    importantDates: []
  },
  {
    id: 4,
    name: "Елена Сергеева",
    phone: "+7 (777) 456-78-90",
    contacts: {
      whatsapp: "+7 (777) 456-78-90",
      instagram: "@elena_s",
      address: "ул. Сатпаева 22, кв. 45"
    },
    tags: ["Регулярный", "День рождения: 15 марта"],
    totalOrders: 12,
    totalSpent: 280000,
    lastOrder: "2024-01-12",
    joinDate: "2023-03-20",
    preferences: {
      favoriteFlowers: ["Пионы", "Гортензии"],
      allergies: [],
      preferredColors: ["Пастельные"],
      preferredDeliveryTime: "День"
    },
    notes: [],
    importantDates: [
      {
        id: 1,
        occasion: "День рождения",
        date: "1988-03-15"
      }
    ]
  },
  {
    id: 5,
    name: "Дмитрий Козлов",
    phone: "+7 (777) 567-89-01",
    contacts: {
      whatsapp: "+7 (777) 567-89-01",
      instagram: "@dima_k",
      address: ""
    },
    tags: ["Редкие заказы", "Предпочитает самовывоз"],
    totalOrders: 4,
    totalSpent: 95000,
    lastOrder: "2023-12-25",
    joinDate: "2023-08-10",
    preferences: {
      favoriteFlowers: ["Розы"],
      allergies: [],
      preferredColors: ["Красный"],
      preferredDeliveryTime: "Вечер"
    },
    notes: [],
    importantDates: []
  },
  {
    id: 6,
    name: "Наталья Ким",
    phone: "+7 (777) 678-90-12",
    contacts: {
      whatsapp: "+7 (777) 678-90-12",
      instagram: "@nataly_kim",
      address: "ул. Жандосова 58, кв. 89"
    },
    tags: ["VIP", "Свадебные букеты"],
    totalOrders: 20,
    totalSpent: 850000,
    lastOrder: "2024-01-14",
    joinDate: "2023-02-01",
    preferences: {
      favoriteFlowers: ["Розы", "Пионы", "Орхидеи"],
      allergies: [],
      preferredColors: ["Белый", "Розовый"],
      preferredDeliveryTime: "Утро"
    },
    notes: [
      {
        id: 1,
        text: "Организатор свадеб, часто заказывает оформление",
        date: "2023-11-30",
        author: "Менеджер Алия"
      }
    ],
    importantDates: []
  },
  {
    id: 7,
    name: "Артур Ли",
    phone: "+7 (777) 789-01-23",
    contacts: {
      whatsapp: "+7 (777) 789-01-23",
      instagram: "@arthur_lee",
      address: "пр. Абая 150"
    },
    tags: ["Корпоративный", "Праздничные композиции"],
    totalOrders: 10,
    totalSpent: 420000,
    lastOrder: "2024-01-05",
    joinDate: "2023-05-15",
    preferences: {
      favoriteFlowers: ["Хризантемы", "Лилии"],
      allergies: [],
      preferredColors: ["Яркие"],
      preferredDeliveryTime: "День"
    },
    notes: [],
    importantDates: []
  },
  {
    id: 8,
    name: "София Ахметова",
    phone: "+7 (777) 890-12-34",
    contacts: {
      whatsapp: "+7 (777) 890-12-34",
      instagram: "@sofia_a",
      address: "ул. Тимирязева 42, кв. 15"
    },
    tags: ["Регулярный", "Любит экзотику"],
    totalOrders: 8,
    totalSpent: 290000,
    lastOrder: "2024-01-09",
    joinDate: "2023-07-20",
    preferences: {
      favoriteFlowers: ["Орхидеи", "Антуриумы"],
      allergies: ["Лилии"],
      preferredColors: ["Экзотические"],
      preferredDeliveryTime: "Утро"
    },
    notes: [
      {
        id: 1,
        text: "Предпочитает редкие и необычные цветы",
        date: "2023-12-15",
        author: "Менеджер Дина"
      }
    ],
    importantDates: []
  },
  {
    id: 9,
    name: "Игорь Попов",
    phone: "+7 (777) 901-23-45",
    contacts: {
      whatsapp: "+7 (777) 901-23-45",
      instagram: "@igor_p",
      address: ""
    },
    tags: ["Новый клиент"],
    totalOrders: 2,
    totalSpent: 45000,
    lastOrder: "2024-01-13",
    joinDate: "2023-12-20",
    preferences: {
      favoriteFlowers: [],
      allergies: [],
      preferredColors: [],
      preferredDeliveryTime: "Вечер"
    },
    notes: [],
    importantDates: []
  },
  {
    id: 10,
    name: "Айгерим Нурланова",
    phone: "+7 (777) 012-34-56",
    contacts: {
      whatsapp: "+7 (777) 012-34-56",
      instagram: "@aigerim_n",
      address: "ул. Розыбакиева 247, кв. 89"
    },
    tags: ["Регулярный", "День рождения: 20 апреля"],
    totalOrders: 15,
    totalSpent: 380000,
    lastOrder: "2024-01-11",
    joinDate: "2023-04-10",
    preferences: {
      favoriteFlowers: ["Тюльпаны", "Розы"],
      allergies: [],
      preferredColors: ["Желтый", "Оранжевый"],
      preferredDeliveryTime: "День"
    },
    notes: [],
    importantDates: [
      {
        id: 1,
        occasion: "День рождения",
        date: "1992-04-20"
      }
    ]
  }
];

class ClientsService {
  // Получение списка клиентов с фильтрацией и пагинацией
  async getClients({ search = '', page = 1, limit = 10 }) {
    // Имитация задержки сети
    await new Promise(resolve => setTimeout(resolve, 500));

    let filteredClients = MOCK_CLIENTS;

    // Применяем поиск
    if (search) {
      const searchLower = search.toLowerCase();
      filteredClients = filteredClients.filter(client => 
        client.name.toLowerCase().includes(searchLower) ||
        client.phone.includes(search) ||
        client.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Вычисляем пагинацию
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedClients = filteredClients.slice(startIndex, endIndex);

    return {
      clients: paginatedClients,
      totalPages: Math.ceil(filteredClients.length / limit),
      totalClients: filteredClients.length
    };
  }

  // Получение данных конкретного клиента
  async getClientProfile(clientId) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const client = MOCK_CLIENTS.find(c => c.id === clientId);
    if (!client) {
      throw new Error('Client not found');
    }
    
    return client;
  }

  // Обновление основной информации о клиенте
  async updateClientInfo(clientId, updates) {
    await new Promise(resolve => setTimeout(resolve, 300));

    const clientIndex = MOCK_CLIENTS.findIndex(c => c.id === clientId);
    if (clientIndex === -1) {
      throw new Error('Client not found');
    }

    // В реальном API здесь был бы PUT запрос
    MOCK_CLIENTS[clientIndex] = {
      ...MOCK_CLIENTS[clientIndex],
      ...updates
    };

    return MOCK_CLIENTS[clientIndex];
  }

  // Обновление контактной информации
  async updateClientContacts(clientId, contacts) {
    await new Promise(resolve => setTimeout(resolve, 300));

    const clientIndex = MOCK_CLIENTS.findIndex(c => c.id === clientId);
    if (clientIndex === -1) {
      throw new Error('Client not found');
    }

    MOCK_CLIENTS[clientIndex].contacts = {
      ...MOCK_CLIENTS[clientIndex].contacts,
      ...contacts
    };

    return MOCK_CLIENTS[clientIndex];
  }

  // Обновление тегов клиента
  async updateClientTags(clientId, tags) {
    await new Promise(resolve => setTimeout(resolve, 300));

    const clientIndex = MOCK_CLIENTS.findIndex(c => c.id === clientId);
    if (clientIndex === -1) {
      throw new Error('Client not found');
    }

    MOCK_CLIENTS[clientIndex].tags = tags;
    return MOCK_CLIENTS[clientIndex];
  }

  // Добавление заметки
  async addClientNote(clientId, note) {
    await new Promise(resolve => setTimeout(resolve, 300));

    const clientIndex = MOCK_CLIENTS.findIndex(c => c.id === clientId);
    if (clientIndex === -1) {
      throw new Error('Client not found');
    }

    const newNote = {
      id: Date.now(),
      text: note.text,
      date: new Date().toISOString(),
      author: "Текущий пользователь", // В реальном приложении брать из контекста авторизации
      category: note.category
    };

    MOCK_CLIENTS[clientIndex].notes.unshift(newNote);
    return newNote;
  }

  // Добавление важной даты
  async addImportantDate(clientId, date) {
    await new Promise(resolve => setTimeout(resolve, 300));

    const clientIndex = MOCK_CLIENTS.findIndex(c => c.id === clientId);
    if (clientIndex === -1) {
      throw new Error('Client not found');
    }

    const newDate = {
      id: Date.now(),
      ...date
    };

    MOCK_CLIENTS[clientIndex].importantDates.push(newDate);
    return newDate;
  }

  // Обновление предпочтений клиента
  async updateClientPreferences(clientId, preferences) {
    await new Promise(resolve => setTimeout(resolve, 300));

    const clientIndex = MOCK_CLIENTS.findIndex(c => c.id === clientId);
    if (clientIndex === -1) {
      throw new Error('Client not found');
    }

    MOCK_CLIENTS[clientIndex].preferences = {
      ...MOCK_CLIENTS[clientIndex].preferences,
      ...preferences
    };

    return MOCK_CLIENTS[clientIndex];
  }
}

export const clientsService = new ClientsService();
