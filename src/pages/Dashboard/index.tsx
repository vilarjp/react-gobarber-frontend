import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { isToday, format, parseISO, isAfter } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { FiPower, FiUser, FiClock } from 'react-icons/fi';
import ReacDayPicker, { DayModifiers } from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import { Link } from 'react-router-dom';
import Button from '../../components/Button';

import { useAuth } from '../../hooks/auth';

import {
  Container,
  Header,
  HeaderContent,
  Profile,
  Content,
  Schedule,
  Loading,
  NextAppointment,
  Section,
  Appointment,
  Calendar,
} from './styles';

import logoImg from '../../assets/logo.svg';
import api from '../../services/api';

interface MonthAvailabilityItem {
  day: number;
  available: boolean;
}

interface Appointment {
  id: string;
  date: string;
  hourFormatted: string;
  user: {
    name: string;
    avatar_url: string;
  };
}

const Dashboard: React.FC = () => {
  const [selectDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [monthAvailability, setMonthAvailability] = useState<
    MonthAvailabilityItem[]
  >([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);

  const { user, signOut } = useAuth();

  const handleDateChange = useCallback((day: Date, modifiers: DayModifiers) => {
    if (modifiers.available && !modifiers.disabled) {
      setSelectedDate(day);
    }
  }, []);

  const handleMonthChage = useCallback((month: Date) => {
    setCurrentMonth(month);
  }, []);

  useEffect(() => {
    api
      .get(`/providers/${user.id}/month-availability`, {
        params: {
          year: currentMonth.getFullYear(),
          month: currentMonth.getMonth() + 1,
        },
      })
      .then(response => {
        setMonthAvailability(response.data);
      });
  }, [user.id, currentMonth]);

  useEffect(() => {
    setLoading(true);
    api
      .get<Appointment[]>('/appointments/schedule', {
        params: {
          year: selectDate.getFullYear(),
          month: selectDate.getMonth() + 1,
          day: selectDate.getDate(),
        },
      })
      .then(response => {
        const appointmentsFormatted = response.data.map(appointment => {
          return {
            ...appointment,
            hourFormatted: format(parseISO(appointment.date), 'HH:mm'),
          };
        });
        setAppointments(appointmentsFormatted);
      })
      .finally(() => setLoading(false));
  }, [selectDate]);

  const disabledDays = useMemo(() => {
    const dates = monthAvailability
      .filter(monthDay => monthDay.available === false)
      .map(monthDay => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();

        return new Date(year, month, monthDay.day);
      });
    return dates;
  }, [currentMonth, monthAvailability]);

  const selectDayAsText = useMemo(() => {
    return format(selectDate, "'Dia' dd 'de' MMMM", {
      locale: ptBR,
    });
  }, [selectDate]);

  const selectedWeekDay = useMemo(() => {
    return format(selectDate, 'cccc', {
      locale: ptBR,
    });
  }, [selectDate]);

  const morningAppointments = useMemo(() => {
    return appointments.filter(appointment => {
      return parseISO(appointment.date).getHours() < 12;
    });
  }, [appointments]);

  const afterenoonAppointments = useMemo(() => {
    return appointments.filter(appointment => {
      return parseISO(appointment.date).getHours() >= 12;
    });
  }, [appointments]);

  const nextAppointment = useMemo(() => {
    return appointments.find(appointment =>
      isToday(parseISO(appointment.date)),
    );
  }, [appointments]);

  return (
    <Container>
      <Header>
        <HeaderContent>
          <img src={logoImg} alt="GoBarber" />

          <Profile>
            {user.avatar_url ? (
              <img src={user.avatar_url} alt={user.name} />
            ) : (
              <FiUser size={30} />
            )}

            <div>
              <span>Bem vindo,</span>
              <Link to="/profile" title="Visualizar perfil">
                <strong>{user.name}</strong>
              </Link>
            </div>
          </Profile>

          <Button type="button" onClick={signOut} title="Sair">
            <FiPower size={22} />
          </Button>
        </HeaderContent>
      </Header>

      <Content>
        <Schedule>
          <h1>Horários agendados</h1>
          <p>
            {isToday(selectDate) && <span>Hoje</span>}
            <span>{selectDayAsText}</span>
            <span>{selectedWeekDay}</span>
          </p>
          {loading ? (
            <Loading
              style={{
                height: '400px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <h2>Carregando...</h2>
            </Loading>
          ) : (
            <>
              {nextAppointment &&
                isAfter(new Date(nextAppointment.date), new Date()) && (
                  <NextAppointment>
                    <h2>Agendamento a seguir</h2>
                    <div>
                      {nextAppointment?.user?.avatar_url ? (
                        <img
                          src={nextAppointment?.user?.avatar_url}
                          alt={nextAppointment?.user?.name}
                        />
                      ) : (
                        <FiUser size={20} />
                      )}
                      <strong>{nextAppointment?.user?.name}</strong>
                      <span>
                        <FiClock />
                        {nextAppointment?.hourFormatted}
                      </span>
                    </div>
                  </NextAppointment>
                )}

              <Section>
                <strong>Manhã</strong>

                {morningAppointments.length > 0 ? (
                  morningAppointments.map(appointment => (
                    <Appointment key={appointment.id}>
                      <span>
                        <FiClock />
                        {appointment.hourFormatted}
                      </span>

                      <div>
                        {appointment.user.avatar_url ? (
                          <img
                            src={appointment.user.avatar_url}
                            alt={appointment.user.name}
                          />
                        ) : (
                          <FiUser size={20} />
                        )}
                        <strong>{appointment.user.name}</strong>
                      </div>
                    </Appointment>
                  ))
                ) : (
                  <p>Nenhum agendamento foi encontrado para o turno da manhã</p>
                )}
              </Section>

              <Section>
                <strong>Tarde</strong>

                {afterenoonAppointments.length > 0 ? (
                  afterenoonAppointments.map(appointment => (
                    <Appointment key={appointment.id}>
                      <span>
                        <FiClock />
                        {appointment.hourFormatted}
                      </span>

                      <div>
                        {appointment.user.avatar_url ? (
                          <img
                            src={appointment.user.avatar_url}
                            alt={appointment.user.name}
                          />
                        ) : (
                          <FiUser size={20} />
                        )}
                        <strong>{appointment.user.name}</strong>
                      </div>
                    </Appointment>
                  ))
                ) : (
                  <p>Nenhum agendamento foi encontrado para o turno da tarde</p>
                )}
              </Section>
            </>
          )}
        </Schedule>

        <Calendar>
          <ReacDayPicker
            weekdaysShort={['D', 'S', 'T', 'Q', 'Q', 'S', 'S']}
            fromMonth={new Date()}
            disabledDays={[{ daysOfWeek: [0, 6] }, ...disabledDays, selectDate]}
            modifiers={{
              available: { daysOfWeek: [1, 2, 3, 4, 5] },
            }}
            onMonthChange={handleMonthChage}
            selectedDays={selectDate}
            onDayClick={handleDateChange}
            months={[
              'Janeiro',
              'Fevereiro',
              'Março',
              'Abril',
              'Maio',
              'Junho',
              'Julho',
              'Agosto',
              'Setembro',
              'Outubro',
              'Novembro',
              'Dezembro',
            ]}
          />
        </Calendar>
      </Content>
    </Container>
  );
};

export default Dashboard;
