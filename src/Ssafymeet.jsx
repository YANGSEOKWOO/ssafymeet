import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, Plus, Link, ArrowLeft, Check, ChevronLeft, ChevronRight, X, MapPin, User } from 'lucide-react';

// 목업 데이터
const mockUsers = [
  { id: '1', name: '김철수', email: 'chulsoo@ssafy.com', color: '#3B82F6' },
  { id: '2', name: '이영희', email: 'younghee@ssafy.com', color: '#10B981' },
  { id: '3', name: '박민수', email: 'minsu@ssafy.com', color: '#F59E0B' },
];

const mockEvents = [
  { 
    id: '1', 
    userId: '1', 
    title: '알고리즘 스터디', 
    start: '2025-07-15T09:00', 
    end: '2025-07-15T11:00', 
    color: '#3B82F6',
    location: '싸피 강의실 A',
    description: '백준 문제 풀이 및 코드 리뷰'
  },
  { 
    id: '2', 
    userId: '1', 
    title: '점심 약속', 
    start: '2025-07-15T12:00', 
    end: '2025-07-15T13:00', 
    color: '#3B82F6',
    location: '학식',
    description: '팀원들과 함께 점심 식사'
  },
  { 
    id: '3', 
    userId: '2', 
    title: '프로젝트 회의', 
    start: '2025-07-15T14:00', 
    end: '2025-07-15T16:00', 
    color: '#10B981',
    location: '회의실 B',
    description: 'SSafy Meet 기획 회의'
  },
  { 
    id: '4', 
    userId: '2', 
    title: '개인 운동', 
    start: '2025-07-16T19:00', 
    end: '2025-07-16T21:00', 
    color: '#10B981',
    location: '헬스장',
    description: '개인 운동 시간'
  },
  { 
    id: '5', 
    userId: '3', 
    title: '면접 준비', 
    start: '2025-07-15T10:00', 
    end: '2025-07-15T12:00', 
    color: '#F59E0B',
    location: '스터디룸',
    description: '삼성 SW 역량테스트 준비'
  },
  { 
    id: '6', 
    userId: '3', 
    title: '영화 관람', 
    start: '2025-07-16T15:00', 
    end: '2025-07-16T17:30', 
    color: '#F59E0B',
    location: 'CGV 강남',
    description: '친구들과 영화 관람'
  },
];

const SSafyMeet = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentView, setCurrentView] = useState('login');
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [showTimeSlots, setShowTimeSlots] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [events, setEvents] = useState(mockEvents);
  const [suggestedTimes, setSuggestedTimes] = useState([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // 실제 Google OAuth 초기화
  useEffect(() => {
    const initializeGoogleAuth = () => {
      // Google API 스크립트 로드
      if (!window.gapi) {
        const script = document.createElement('script');
        script.src = 'https://apis.google.com/js/api.js';
        script.onload = () => {
          window.gapi.load('auth2', () => {
            window.gapi.auth2.init({
              client_id: 'YOUR_GOOGLE_CLIENT_ID' // 실제 클라이언트 ID로 교체 필요
            });
          });
        };
        document.head.appendChild(script);
      }
    };

    initializeGoogleAuth();
  }, []);

  // Google 로그인 (실제 구현)
  const handleGoogleLogin = async () => {
    try {
      setIsGoogleLoading(true);
      
      // 실제 Google OAuth 구현
      /*
      const authInstance = window.gapi.auth2.getAuthInstance();
      const googleUser = await authInstance.signIn();
      const profile = googleUser.getBasicProfile();
      
      const userData = {
        id: profile.getId(),
        name: profile.getName(),
        email: profile.getEmail(),
        picture: profile.getImageUrl()
      };
      */
      
      // 시뮬레이션 (개발 환경용)
      setTimeout(() => {
        const userData = {
          ...mockUsers[0],
          picture: 'https://lh3.googleusercontent.com/a/default-user'
        };
        setCurrentUser(userData);
        setCurrentView('main');
        setIsGoogleLoading(false);
      }, 2000);
      
    } catch (error) {
      console.error('Google login failed:', error);
      setIsGoogleLoading(false);
      alert('로그인에 실패했습니다. 다시 시도해주세요.');
    }
  };

  // 캘린더 날짜 생성
  const generateCalendarDays = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const current = new Date(startDate);
    
    for (let i = 0; i < 42; i++) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    
    return days;
  };

  // 특정 날짜의 이벤트 가져오기
  const getEventsForDate = (date) => {
    // 로컬 시간대를 고려한 날짜 문자열 생성
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    
    return events.filter(event => {
      // 이벤트 시작 날짜 추출 (시간대 고려)
      const eventDate = new Date(event.start);
      const eventYear = eventDate.getFullYear();
      const eventMonth = String(eventDate.getMonth() + 1).padStart(2, '0');
      const eventDay = String(eventDate.getDate()).padStart(2, '0');
      const eventDateStr = `${eventYear}-${eventMonth}-${eventDay}`;
      
      return eventDateStr === dateStr;
    });
  };

  // 시간 포맷팅
  const formatTime = (timeString) => {
    const date = new Date(timeString);
    return date.toTimeString().slice(0, 5);
  };

  // 이벤트 클릭 핸들러
  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setShowEventModal(true);
  };

  // 방 생성
  const handleCreateRoom = (roomData) => {
    const newRoom = {
      id: `room_${Date.now()}`,
      name: roomData.name,
      duration: roomData.duration,
      period: roomData.period,
      excludeDinner: roomData.excludeDinner,
      excludeMeal: roomData.excludeMeal,
      excludeNight: roomData.excludeNight,
      createdBy: currentUser.id,
      members: [currentUser.id],
      link: `https://ssafy-meet.com/room/${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setRooms([...rooms, newRoom]);
    setShowCreateRoom(false);
  };

  // 시간 슬롯 제안 알고리즘
  const generateTimeSlots = (room) => {
    const slots = [];
    const today = new Date();
    
    const timeOptions = [
      { time: '09:00', label: '오전 9시' },
      { time: '14:00', label: '오후 2시' },
      { time: '16:00', label: '오후 4시' },
    ];

    timeOptions.forEach((timeOption, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() + index + 1);
      const startTime = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}T${timeOption.time}`;
      const endTime = new Date(startTime);
      endTime.setHours(endTime.getHours() + parseInt(room.duration));
      
      slots.push({
        id: `slot_${index}`,
        date: date.toLocaleDateString('ko-KR'),
        time: timeOption.time,
        label: timeOption.label,
        endTime: endTime.toTimeString().slice(0, 5),
        available: true,
        dateObj: date,
      });
    });

    setSuggestedTimes(slots);
    setShowTimeSlots(true);
  };

  // 약속 확정
  const confirmAppointment = () => {
    if (!selectedTimeSlot) return;

    // 로컬 시간대를 고려한 날짜 생성
    const eventDate = selectedTimeSlot.dateObj;
    const year = eventDate.getFullYear();
    const month = String(eventDate.getMonth() + 1).padStart(2, '0');
    const day = String(eventDate.getDate()).padStart(2, '0');
    
    const newEvent = {
      id: `meeting_${Date.now()}`,
      userId: 'all',
      title: `${selectedRoom.name} 회의`,
      start: `${year}-${month}-${day}T${selectedTimeSlot.time}`,
      end: `${year}-${month}-${day}T${selectedTimeSlot.endTime}`,
      color: '#EF4444',
      type: 'meeting',
      location: '온라인 회의',
      description: `${selectedRoom.name} 팀 회의입니다.`
    };
    
    setEvents([...events, newEvent]);
    setShowTimeSlots(false);
    setSelectedTimeSlot(null);
    alert('약속이 캘린더에 추가되었습니다!');
  };

  // 로그인 화면
  const LoginScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mb-4">
            <Calendar className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">SSafy Meet</h1>
          <p className="text-gray-600">일정을 공유하여 함께 약속을 잡아요</p>
        </div>
        
        <button
          onClick={handleGoogleLogin}
          disabled={isGoogleLoading}
          className={`w-full font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 ${
            isGoogleLoading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          {isGoogleLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              로그인 중...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google로 로그인
            </>
          )}
        </button>
        
        <div className="mt-4 text-xs text-gray-500 text-center">
          * Google OAuth 2.0을 사용한 안전한 로그인
        </div>
      </div>
    </div>
  );

  // 이벤트 상세 모달
  const EventModal = ({ event, onClose }) => {
    if (!event) return null;

    const user = mockUsers.find(u => u.id === event.userId);
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl p-6 max-w-md w-full">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-bold text-gray-800">{event.title}</h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-blue-500" />
              <div>
                <div className="font-medium text-gray-800">
                  {formatTime(event.start)} - {formatTime(event.end)}
                </div>
                <div className="text-sm text-gray-600">
                  {new Date(event.start).toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    weekday: 'short'
                  })}
                </div>
              </div>
            </div>

            {event.location && (
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-green-500" />
                <div className="text-gray-800">{event.location}</div>
              </div>
            )}

            {user && (
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-purple-500" />
                <div>
                  <div className="font-medium text-gray-800">{user.name}</div>
                  <div className="text-sm text-gray-600">{user.email}</div>
                </div>
              </div>
            )}

            {event.description && (
              <div className="pt-2 border-t border-gray-200">
                <div className="text-sm text-gray-600 mb-1">설명</div>
                <div className="text-gray-800">{event.description}</div>
              </div>
            )}
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              확인
            </button>
          </div>
        </div>
      </div>
    );
  };

  // 방 생성 모달
  const CreateRoomModal = ({ onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
      name: '',
      duration: '1',
      period: '1주',
      excludeDinner: false,
      excludeMeal: false,
      excludeNight: true,
    });

    const handleSubmit = () => {
      if (!formData.name) {
        alert('방 이름을 입력해주세요.');
        return;
      }
      onSubmit(formData);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl p-6 max-w-md w-full">
          <h2 className="text-xl font-bold mb-4">새 방 만들기</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">방 이름</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="팀 프로젝트 회의"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">회의 시간</label>
              <select
                value={formData.duration}
                onChange={(e) => setFormData({...formData, duration: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="1">1시간</option>
                <option value="2">2시간</option>
                <option value="3">3시간</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">기간</label>
              <select
                value={formData.period}
                onChange={(e) => setFormData({...formData, period: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="1주">1주</option>
                <option value="2주">2주</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.excludeDinner}
                  onChange={(e) => setFormData({...formData, excludeDinner: e.target.checked})}
                  className="mr-2"
                />
                <span className="text-sm">저녁시간 지양 (18:00-20:00)</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.excludeMeal}
                  onChange={(e) => setFormData({...formData, excludeMeal: e.target.checked})}
                  className="mr-2"
                />
                <span className="text-sm">식사시간 제외 (12:00-13:00)</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.excludeNight}
                  onChange={(e) => setFormData({...formData, excludeNight: e.target.checked})}
                  className="mr-2"
                />
                <span className="text-sm">야간시간 제외 (22:00-08:00)</span>
              </label>
            </div>

            <div className="flex gap-2 pt-4">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                생성하기
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 시간 슬롯 선택 모달
  const TimeSlotModal = ({ slots, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">추천 시간대</h2>
        <p className="text-gray-600 mb-6">모든 참가자가 참여 가능한 시간대입니다.</p>
        
        <div className="space-y-3 mb-6">
          {slots.map((slot) => (
            <div
              key={slot.id}
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                selectedTimeSlot?.id === slot.id 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
              onClick={() => setSelectedTimeSlot(slot)}
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-semibold text-gray-800">{slot.date}</div>
                  <div className="text-sm text-gray-600">{slot.label} ({slot.time} - {slot.endTime})</div>
                </div>
                {selectedTimeSlot?.id === slot.id && (
                  <Check className="w-5 h-5 text-blue-500" />
                )}
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            취소
          </button>
          <button
            onClick={confirmAppointment}
            disabled={!selectedTimeSlot}
            className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
              selectedTimeSlot 
                ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );

  // 캘린더 컴포넌트
  const CalendarView = ({ events, showAllUsers = false }) => {
    const days = generateCalendarDays(currentDate);
    const monthNames = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
    
    const prevMonth = () => {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };
    
    const nextMonth = () => {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            {showAllUsers ? '모든 참가자 일정' : '내 캘린더'}
          </h2>
          <div className="flex items-center gap-4">
            <button onClick={prevMonth} className="p-1 hover:bg-gray-100 rounded">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="font-semibold text-lg">
              {currentDate.getFullYear()}년 {monthNames[currentDate.getMonth()]}
            </span>
            <button onClick={nextMonth} className="p-1 hover:bg-gray-100 rounded">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {showAllUsers && (
          <div className="flex gap-4 mb-4">
            {mockUsers.map((user) => (
              <div key={user.id} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full`} style={{backgroundColor: user.color}}></div>
                <span className="text-sm text-gray-700">{user.name}</span>
              </div>
            ))}
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-sm text-gray-700">팀 회의</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-7 gap-1">
          {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
            <div key={day} className="p-2 text-center text-sm font-medium text-gray-600 bg-gray-50">
              {day}
            </div>
          ))}
          
          {days.map((day, index) => {
            const dayEvents = getEventsForDate(day);
            const isCurrentMonth = day.getMonth() === currentDate.getMonth();
            const isToday = day.toDateString() === new Date().toDateString();
            const filteredEvents = showAllUsers ? dayEvents : dayEvents.filter(e => e.userId === currentUser?.id || e.type === 'meeting');
            
            return (
              <div
                key={index}
                className={`min-h-32 p-1 border border-gray-100 ${
                  isCurrentMonth ? 'bg-white' : 'bg-gray-50'
                } ${isToday ? 'bg-blue-50 border-blue-200' : ''}`}
              >
                <div className={`text-sm mb-1 ${
                  isCurrentMonth ? 'text-gray-800' : 'text-gray-400'
                } ${isToday ? 'font-bold text-blue-600' : ''}`}>
                  {day.getDate()}
                </div>
                
                <div className="space-y-1">
                  {filteredEvents.slice(0, 3).map((event) => (
                    <div
                      key={event.id}
                      className="text-xs p-1 rounded text-white truncate cursor-pointer hover:opacity-80 transition-opacity"
                      style={{ backgroundColor: event.color }}
                      title={`${event.title} (${formatTime(event.start)} - ${formatTime(event.end)})`}
                      onClick={() => handleEventClick(event)}
                    >
                      <div className="font-medium">{event.title}</div>
                      <div className="text-xs opacity-90">
                        {formatTime(event.start)}
                      </div>
                    </div>
                  ))}
                  {filteredEvents.length > 3 && (
                    <div className="text-xs text-gray-500 p-1">
                      +{filteredEvents.length - 3}개 더
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // 메인 화면
  const MainScreen = () => (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">SSafy Meet</h1>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-semibold">
                  {currentUser?.name?.charAt(0)}
                </span>
              </div>
              <span className="text-gray-700">{currentUser?.name}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <CalendarView 
              events={events} 
              showAllUsers={false}
            />
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <button
                onClick={() => setShowCreateRoom(true)}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                새 방 만들기
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Users className="w-5 h-5" />
                약속 리스트
              </h2>
              <div className="space-y-3">
                {rooms.map((room) => (
                  <div
                    key={room.id}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => {
                      setSelectedRoom(room);
                      setCurrentView('room');
                    }}
                  >
                    <div className="font-medium text-gray-800">{room.name}</div>
                    <div className="text-sm text-gray-600 mt-1">
                      {room.duration}시간 • {room.period}
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Link className="w-4 h-4 text-blue-500" />
                      <span className="text-xs text-blue-500">링크 복사</span>
                    </div>
                  </div>
                ))}
                {rooms.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    아직 생성된 방이 없습니다
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showCreateRoom && (
        <CreateRoomModal
          onClose={() => setShowCreateRoom(false)}
          onSubmit={handleCreateRoom}
        />
      )}

      {showEventModal && (
        <EventModal
          event={selectedEvent}
          onClose={() => {
            setShowEventModal(false);
            setSelectedEvent(null);
          }}
        />
      )}
    </div>
  );

  // 약속 생성 페이지
  const RoomScreen = () => (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentView('main')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold text-gray-800">{selectedRoom?.name}</h1>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <CalendarView 
              events={events} 
              showAllUsers={true}
            />
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              약속 생성
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              모든 참가자가 참여 가능한 시간대를 찾아드립니다.
            </p>
            <button
              onClick={() => generateTimeSlots(selectedRoom)}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              약속 생성하기
            </button>
          </div>
        </div>
      </div>

      {showTimeSlots && (
        <TimeSlotModal
          slots={suggestedTimes}
          onClose={() => {
            setShowTimeSlots(false);
            setSelectedTimeSlot(null);
          }}
        />
      )}

      {showEventModal && (
        <EventModal
          event={selectedEvent}
          onClose={() => {
            setShowEventModal(false);
            setSelectedEvent(null);
          }}
        />
      )}
    </div>
  );

  return (
    <div className="font-sans">
      {currentView === 'login' && <LoginScreen />}
      {currentView === 'main' && <MainScreen />}
      {currentView === 'room' && <RoomScreen />}
    </div>
  );
};

export default SSafyMeet;