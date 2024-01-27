# Areas of application

To provide benefit, quantum computers must solve computational problems where the solutions are simultaneously valuable to the user and also difficult to obtain classically. Simply developing a quantum algorithm with a theoretical quantum speedup is not sufficient to meet these criteria: we must directly compare the performance of classical and quantum algorithms for concrete problems of interest.


In this part, we survey a number of specific computational problems where quantum algorithms have been proposed, organized by application area. We present an overview of these algorithms through an end-to-end lens, noting clearly the actual end-to-end problem that is being solved and the dominant resource cost/complexity (derived from the [algorithmic primitives](../quantum-algorithmic-primitives/introduction.md#quantum-algorithmic-primitives) that are being used), and emphasizing noteworthy caveats. We list known resource estimates for implementing these algorithms on [fault-tolerant quantum computers](../fault-tolerant-quantum-computation/introduction.md#fault-tolerant-quantum-computation) (we also comment in passing on NISQ implementations), and we compare to classical complexities for the same problem, both in a practical and asymptotic sense. The list of applications presented is not exhaustive, but represents a broad spectrum of the most well studied applications proposed in the literature.


